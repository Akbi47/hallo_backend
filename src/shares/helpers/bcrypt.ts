import { hash, compare, genSalt } from 'bcrypt';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */

export const generateHash = async (password: string): Promise<{ salt: string; hashPassword: string }> => {
  const salt = await genSalt(10);
  const hashPassword = await hash(password, salt);
  return {
    salt,
    hashPassword,
  };
};

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export const validateHash = (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return compare(password, hash);
};
