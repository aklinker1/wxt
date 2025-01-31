import { describe, it, expect, expectTypeOf, vi } from 'vitest';
import { AsyncRpcService, createRpcProxy, registerRpcService } from '../rpc';
import { createTestMessageTransport } from '../transports';

describe('RPC Messaging API', () => {
  describe('AsyncRpcService types', () => {
    it('should make non-async functions async', () => {
      type input = (a: string, b: boolean) => number;
      type expected = (a: string, b: boolean) => Promise<number>;

      type actual = AsyncRpcService<input>;

      expectTypeOf<actual>().toEqualTypeOf<expected>();
    });

    it('should not change already async functions', () => {
      type input = (a: string, b: boolean) => Promise<number>;
      type expected = input;

      type actual = AsyncRpcService<input>;

      expectTypeOf<actual>().toEqualTypeOf<expected>();
    });

    it('should make class functions async and set non-functions to never', () => {
      class input {
        a: number;
        b(_: number): void {
          throw Error('Not implemented');
        }
        c(_: boolean): Promise<number> {
          throw Error('Not implemented');
        }
      }
      type expected = {
        a: never;
        b: (_: number) => Promise<void>;
        c: (_: boolean) => Promise<number>;
      };

      type actual = AsyncRpcService<input>;

      expectTypeOf<actual>().toEqualTypeOf<expected>();
    });

    it('should convert deeply nested functions on objects to async', () => {
      type input = {
        a: number;
        b: {
          c: (_: number) => void;
          d: boolean;
          e: () => Promise<number>;
        };
        f: () => void;
      };
      type expected = {
        a: never;
        b: {
          c: (_: number) => Promise<void>;
          d: never;
          e: () => Promise<number>;
        };
        f: () => Promise<void>;
      };

      type actual = AsyncRpcService<input>;

      expectTypeOf<actual>().toEqualTypeOf<expected>();
    });
  });

  describe('RPC Behavior', () => {
    it('should support function services', async () => {
      const name = 'test';
      const service = (n: number) => n + 1;
      const input = Math.random();
      const expected = input + 1;
      const transport = createTestMessageTransport();

      registerRpcService(name, service, transport);
      const proxy = createRpcProxy<typeof service>(name, transport);
      const actual = await proxy(input);

      expect(actual).toBe(expected);
    });

    it('should support object services', async () => {
      const service = {
        a: (n: number) => n + 1,
      };
      const input = Math.random();
      const expected = input + 1;
      const name = 'name';
      const transport = createTestMessageTransport();

      registerRpcService(name, service, transport);
      const proxy = createRpcProxy<typeof service>(name, transport);
      const actual = await proxy.a(input);

      expect(actual).toEqual(expected);
    });

    it('should support class services', async () => {
      class Service {
        a(n: number) {
          return n + 1;
        }
      }
      const service = new Service();
      const input = Math.random();
      const expected = input + 1;
      const name = 'name';
      const transport = createTestMessageTransport();

      registerRpcService(name, service, transport);
      const proxy = createRpcProxy<typeof service>(name, transport);
      const actual = await proxy.a(input);

      expect(actual).toEqual(expected);
    });

    it('should support deeply nested services', async () => {
      const service = {
        a: {
          b: (n: number) => n + 1,
        },
      };
      const input = Math.random();
      const expected = input + 1;
      const name = 'name';
      const transport = createTestMessageTransport();

      registerRpcService(name, service, transport);
      const proxy = createRpcProxy<typeof service>(name, transport);
      const actual = await proxy.a.b(input);

      expect(actual).toEqual(expected);
    });

    it('should bind `this` to the object containing the function being executed', async () => {
      const service = {
        a: {
          b() {
            return this;
          },
        },
        c() {
          return this;
        },
      };
      const input = Math.random();
      const expected = input + 1;
      const name = 'name';
      const transport = createTestMessageTransport();

      registerRpcService(name, service, transport);
      const proxy = createRpcProxy<typeof service>(name, transport);

      expect(await proxy.a.b()).toBe(service.a);
      expect(await proxy.c()).toBe(service);
    });
  });
});
