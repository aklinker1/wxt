import { describe, it, expect } from 'vitest';
import { removeMainFunctionCode } from '../transform';

describe('Transform Utils', () => {
  describe('removeMainFunctionCode', () => {
    it.each(['defineBackground', 'defineUnlistedScript'])(
      'should remove the first arrow function argument for %s',
      (def) => {
        const input = `
          export default ${def}(() => {
            console.log();
          })
        `;
        const expected = `export default ${def}();`;

        const actual = removeMainFunctionCode(input).code;

        expect(actual).toEqual(expected);
      },
    );

    it.each(['defineBackground', 'defineUnlistedScript'])(
      'should remove the first function argument for %s',
      (def) => {
        const input = `
          export default ${def}(function () {
            console.log();
          })
        `;
        const expected = `export default ${def}();`;

        const actual = removeMainFunctionCode(input).code;

        expect(actual).toEqual(expected);
      },
    );

    it.each([
      'defineBackground',
      'defineContentScript',
      'defineUnlistedScript',
    ])('should remove the main field from %s', (def) => {
      const input = `
        export default ${def}({
          asdf: "asdf",
          main: () => {},
        })
      `;
      const expected = `export default ${def}({
  asdf: "asdf"
})`;

      const actual = removeMainFunctionCode(input).code;

      expect(actual).toEqual(expected);
    });

    it('should remove unused imports', () => {
      const input = `
        import { defineBackground } from "#imports"
        import { test1 } from "somewhere1"
        import test2 from "somewhere2"

        export default defineBackground(() => {})
      `;
      const expected = `import { defineBackground } from "#imports"

export default defineBackground();`;

      const actual = removeMainFunctionCode(input).code;

      expect(actual).toEqual(expected);
    });

    it('should remove explict side-effect imports', () => {
      const input = `
        import { defineBackground } from "#imports"
        import "my-polyfill"
        import "./style.css"

        export default defineBackground(() => {})
      `;
      const expected = `import { defineBackground } from "#imports"

export default defineBackground();`;

      const actual = removeMainFunctionCode(input).code;

      expect(actual).toEqual(expected);
    });

    it("should remove any functions delcared outside the main function that aren't used", () => {
      const input = `
              function getMatches() {
                return ["*://*/*"]
              }
              function unused1() {}
              function unused2() {
                unused1();
              }

              export default defineContentScript({
                matches: getMatches(),
                main: () => {},
              })
            `;
      const expected = `function getMatches() {
  return ["*://*/*"]
}

export default defineContentScript({
  matches: getMatches()
})`;

      const actual = removeMainFunctionCode(input).code;

      expect(actual).toEqual(expected);
    });

    it("should remove any variables delcared outside the main function that aren't used", () => {
      const input = `
        const unused1 = "a", matches = ["*://*/*"];
        let unused2 = unused1 + "b";

        export default defineContentScript({
          matches,
          main: () => {}
        })
      `;
      const expected = `const matches = ["*://*/*"];

export default defineContentScript({
  matches
})`;

      const actual = removeMainFunctionCode(input).code;

      expect(actual).toEqual(expected);
    });
  });
});
