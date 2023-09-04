import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Plugin } from 'vite';

const dirName = dirname(fileURLToPath(import.meta.url));

const buildPath = 'dist';

const createRedirectsFile = async () => {
  const data = {
    filename: '_redirects',
    content: '/*   /index.html   200\n',
  };

  try {
    await writeFile(resolve(dirName, `../${buildPath}/${data.filename}`), data.content, 'utf-8');
    console.log('\x1b[1;32mSuccessfully created _redirects file for deployment\x1b[0m');
  } catch (error: unknown) {
    console.log(
      `\x1b[1;31mAn error occurred while creating the _redirects file${
        error instanceof Error ? `:${error.message}` : ''
      }\x1b[0m`
    );
  }
};

const createRedirectsFilePlugin = (): Plugin => {
  return {
    name: 'create-redirects-file-plugin',
    closeBundle: async () => {
      await createRedirectsFile();
    },
  };
};

export { createRedirectsFilePlugin };
