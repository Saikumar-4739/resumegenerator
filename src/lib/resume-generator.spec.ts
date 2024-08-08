import { resumeGenerator } from './resume-generator';

describe('resumeGenerator', () => {
  it('should work', () => {
    expect(resumeGenerator()).toEqual('resume_generator');
  });
});
