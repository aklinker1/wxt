import { describe, it, expect, vi } from 'vitest';
import { createTestMessageTransport } from '../test-message-transport';

describe('Test Message Transport Behavior', () => {
  describe('Broadcasts', () => {
    it('should trigger related onBroadcast listeners', async () => {
      const transport = createTestMessageTransport();
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const data = Symbol('data');
      const type = 'type';
      const expectedMetadata = {
        id: expect.any(Number),
        sentAt: expect.any(Number),
        data,
        sender: undefined,
        target: undefined,
        type,
      };

      transport.onBroadcast('not' + type, callback1);
      transport.onBroadcast(type, callback2);
      await transport.sendBroadcast(type, data);

      expect(callback1).not.toBeCalled();
      expect(callback2).toBeCalledTimes(1);
      expect(callback2).toBeCalledWith(data, expectedMetadata);
    });

    it('should not throw an error when onBroadcast throws an error', async () => {
      const transport = createTestMessageTransport();
      const type = 'type';

      transport.onBroadcast(
        type,
        vi.fn(() => {
          throw Error('test error');
        }),
      );

      await transport.sendBroadcast(type);
    });
  });

  describe('Requests', () => {
    it('should resolve to the first response for the type', async () => {
      const type = 'type';
      const data = Symbol('data');
      const transport = createTestMessageTransport();
      const expected = 2;

      const callback1 = vi.fn().mockResolvedValue(1);
      const callback2 = vi.fn().mockResolvedValue(2);
      const callback3 = vi.fn().mockResolvedValue(3);

      transport.onRequest('not' + type, callback1);
      transport.onRequest(type, callback2);
      transport.onRequest(type, callback3);
      const actual = await transport.sendRequest(type, data);

      expect(actual).toEqual(expected);
      expect(callback1).not.toBeCalled();
      expect(callback2).toBeCalledTimes(1);
      expect(callback3).toBeCalledTimes(1);
    });

    it('should throw the same error thrown by the onRequest callback', async () => {
      const transport = createTestMessageTransport();
      const type = 'type';
      const expected = Error('test error');

      transport.onRequest(
        type,
        vi.fn(() => {
          throw expected;
        }),
      );

      const res = transport.sendRequest(type);

      await expect(res).rejects.toThrow(expected);
    });
  });
});
