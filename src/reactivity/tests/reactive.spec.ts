
import{ isReactive, isReadonly, reactive } from '../reactive'
describe('reactive', () => {
    it('happy path', () => {
        const original = {foo:1}
        const observed = reactive(original)
        expect(observed).not.toBe(original);
        expect(isReactive(observed)).toBe(true)
        expect(isReadonly(observed)).toBe(false);
        expect(observed.foo).toBe(1);
    });
});