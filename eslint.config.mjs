const eslintConfig = [
  {
    ignores: [".next/**", "dist/**", "node_modules/**"],
  },
  {
    rules: {
      "no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
