import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"dist/**",
			"coverage/**",
			".nyc_output/**",
			"node_modules/**",
			".yalc/**",
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.{js,mjs,cjs,ts}"],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			"@typescript-eslint/no-explicit-any": "error",
		},
	},
	{
		files: ["scripts/**/*.cjs", "scripts/**/*.mjs"],
		rules: {
			"@typescript-eslint/no-require-imports": "off",
			"no-console": "off",
		},
	},
	{
		files: ["src/**/*.ts", "tests/**/*.ts"],
		rules: {
			"no-console": "off",
		},
	},
);
