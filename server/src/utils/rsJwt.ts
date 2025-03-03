const crypto = require('crypto')

interface JWTToken {
	headers: any
	payload: any
	sign: Uint8Array | null
	verify?: Record<string, boolean>
}

interface Algorithm {
	[key: string]: string
}

class RJWT {
	private jwt_token: JWTToken = {
		headers: null,
		payload: null,
		sign: null
	}

	private static ds(s: Record<string, any> | null = null): Uint8Array {
		return new TextEncoder().encode(JSON.stringify(s, null, 0))
	}

	private static async createHmac(
		key: Uint8Array,
		message: Uint8Array,
		algorithm: string
	): Promise<Uint8Array> {
		const algorithmMap: Algorithm = {
			HS256: 'SHA-256',
			SHA384: 'SHA-384',
			SHA512: 'SHA-512'
		}

		const cryptoKey = await crypto.subtle.importKey(
			'raw',
			key,
			{ name: 'HMAC', hash: { name: algorithmMap[algorithm] } },
			false,
			['sign']
		)

		const signature = await crypto.subtle.sign('HMAC', cryptoKey, message)

		return new Uint8Array(signature)
	}

	private static urlsafeB64Encode(buffer: Uint8Array): string {
		return btoa(Array.from(buffer, byte => String.fromCharCode(byte)).join(''))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '')
	}

	private static urlsafeB64Decode(str: string): Uint8Array {
		str = str.replace(/-/g, '+').replace(/_/g, '/')
		while (str.length % 4) str += '='

		try {
			return Uint8Array.from(atob(str), c => c.charCodeAt(0))
		} catch (e) {
			throw new Error('Invalid base64 string')
		}
	}

	async encode(
		payload: Record<string, any>,
		secretKey: string | Uint8Array,
		algorithm: string = 'HS256',
		issuer?: string,
		audience?: string | string[]
	): Promise<string> {
		const header = { typ: 'JWT', alg: algorithm }
		const payloadCopy = { ...payload }

		if (issuer) {
			payloadCopy.iss = issuer
		}

		if (audience) {
			payloadCopy.aud = audience
		}

		// Конвертация дат в UNIX timestamp
		;['exp', 'iat', 'nbf'].forEach(timeField => {
			if (payloadCopy[timeField] instanceof Date) {
				payloadCopy[timeField] = Math.floor(
					payloadCopy[timeField].getTime() / 1000
				)
			}
		})

		const key =
			typeof secretKey === 'string'
				? new TextEncoder().encode(secretKey)
				: secretKey

		const headerEncoded = RJWT.urlsafeB64Encode(RJWT.ds(header))
		const payloadEncoded = RJWT.urlsafeB64Encode(RJWT.ds(payloadCopy))

		const signatureInput = new TextEncoder().encode(
			`${headerEncoded}.${payloadEncoded}`
		)
		const signature = await RJWT.createHmac(key, signatureInput, algorithm)
		const signatureEncoded = RJWT.urlsafeB64Encode(signature)

		return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`
	}

	async decode(
		jwt: string,
		secretKey?: string | Uint8Array,
		verify: boolean = false,
		issuer?: string,
		audience?: string | string[],
		leeway: number = 0
	): Promise<JWTToken> {
		const [headerB64, payloadB64, signatureB64] = jwt.split('.')

		const header = JSON.parse(
			new TextDecoder().decode(RJWT.urlsafeB64Decode(headerB64))
		)
		const payload = JSON.parse(
			new TextDecoder().decode(RJWT.urlsafeB64Decode(payloadB64))
		)
		const signature = RJWT.urlsafeB64Decode(signatureB64)

		this.jwt_token = {
			headers: header,
			payload: payload,
			sign: signature
		}

		if (verify && secretKey) {
			const key =
				typeof secretKey === 'string'
					? new TextEncoder().encode(secretKey)
					: secretKey

			const signatureInput = new TextEncoder().encode(
				`${headerB64}.${payloadB64}`
			)
			const expectedSignature = await RJWT.createHmac(
				key,
				signatureInput,
				header.alg
			)

			const verifyOptions: Record<string, boolean> = {
				v_sig: this.compareUint8Arrays(signature, expectedSignature)
			}

			const now = Math.floor(Date.now() / 1000)

			if ('iat' in payload) {
				verifyOptions.v_iat = payload.iat < now
			}

			if ('exp' in payload) {
				verifyOptions.v_exp = payload.exp >= now - leeway
			}

			if ('iss' in payload && issuer) {
				verifyOptions.v_iss = payload.iss === issuer
			}

			this.jwt_token.verify = verifyOptions
		}

		return this.jwt_token
	}

	private compareUint8Arrays(a: Uint8Array, b: Uint8Array): boolean {
		if (a.length !== b.length) return false
		return a.every((val, i) => val === b[i])
	}
}

export const cls_rs_jwt = new RJWT()

/**
 * Пример использования:
 *
 * const s_key = 'ae9d752c1ced4be79833f622d21f9a24';
 *
 * // Кодирование
 * const token = await cls_rs_jwt.encode({ payload: 'values' }, s_key);
 *
 * // Декодирование с проверкой
 * const decoded = await cls_rs_jwt.decode(token, s_key, true);
 */
