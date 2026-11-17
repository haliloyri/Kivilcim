const captions = require('../captions.json');
const { validateCaptions } = require('../captions');

const clone = () => JSON.parse(JSON.stringify(captions));

describe('validateCaptions', () => {
  it('accepts the shipped captions', () => {
    expect(validateCaptions(captions)).toEqual([]);
  });

  it('flags a missing language', () => {
    const c = clone(); delete c.de;
    expect(validateCaptions(c).join('\n')).toMatch(/de/);
  });

  it('flags a language with 5 frames', () => {
    const c = clone(); c.es.frames.pop();
    expect(validateCaptions(c).join('\n')).toMatch(/es/);
  });

  it('flags a 43-character caption', () => {
    const c = clone(); c.en.frames[2] = 'x'.repeat(43);
    expect(validateCaptions(c).join('\n')).toMatch(/en/);
  });

  it('flags an empty disclosure', () => {
    const c = clone(); c.tr.disclosure = '';
    expect(validateCaptions(c).join('\n')).toMatch(/tr/);
  });

  it('ignores emphasis stars in the length', () => {
    const c = clone(); c.en.frames[2] = `*${'x'.repeat(42)}*`;
    expect(validateCaptions(c)).toEqual([]);
  });

  it('flags an unclosed emphasis star', () => {
    const c = clone(); c.en.frames[2] = 'Turn *ideas';
    expect(validateCaptions(c).join('\n')).toMatch(/en/);
  });

  it('flags a missing subtitle', () => {
    const c = clone(); c.de.subs.pop();
    expect(validateCaptions(c).join('\n')).toMatch(/de/);
  });

  it('flags a 53-character subtitle', () => {
    const c = clone(); c.tr.subs[0] = 'x'.repeat(53);
    expect(validateCaptions(c).join('\n')).toMatch(/tr/);
  });

  it('flags an empty tagline', () => {
    const c = clone(); c.es.tagline = ' ';
    expect(validateCaptions(c).join('\n')).toMatch(/es/);
  });
});
