export const notConfiguredError = `
tsc-strict isn't configured in tsconfig.json
        
Please add following configuration:
{
  "compilerOptions": {
    ...
    "plugins": [{
      "name": "tsc-strict"
    }]
  },
}
`;

export const noStrictFilesError = `
Project does not contain any strict files.
`;
