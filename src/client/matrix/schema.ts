import { parser as schemasafeParser, Schema, ValidatorOptions } from "@exodus/schemasafe";

const parserOptions: ValidatorOptions = {
	mode: 'default',
	requireValidation: false,
	complexityChecks: true
};

namespace schema {
	export const _well_known_matrix_client = schemasafeParser({
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"m.homeserver": {
				"type": "object",
				"properties": {
					"base_url": {
						"type": "string",
						"format": "uri",
						"pattern": "^https://.*$"
					}
				},
				"required": [
					"base_url"
				]
			},
			"m.identity_server": {
				"type": "object",
				"properties": {
					"base_url": {
						"type": "string",
						"format": "uri",
						"pattern": "^https?://.*$"
					}
				},
				"required": [
					"base_url"
				]
			}
		},
		"required": [
			"m.homeserver"
		]
	}, parserOptions)

	export const client_versions = schemasafeParser({
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"unstable_features": {
				"type": "object",
				"properties": {},
				"required": []
			},
			"versions": {
				"type": "array",
				"items": {
					"type": "string"
				}
			}
		},
		"required": [
			"versions"
		]
	}, parserOptions)

	export const response_error = schemasafeParser({
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"errcode": {
				"type": "string"
			},
			"error": {
				"type": "string"
			},
			"retry_after_ms": {
				"type": "number"
			}
		},
		"required": [
			"errcode"
		]
	}, parserOptions)

	export const GET_client_v3_login = schemasafeParser({
		"$schema": "http://json-schema.org/draft-07/schema#",
		"properties": {
			"flows": {
				"type": "array",
				"items": {
					"type": "object",
					"properties": {
						"type": {
							"type": "string"
						}
					},
					"required": [
						"type"
					]
				}
			}
		},
		"required": [
			"flows"
		]
	}, parserOptions)
}

export default schema
