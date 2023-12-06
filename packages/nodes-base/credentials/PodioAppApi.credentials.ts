import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

export class PodioAppApi implements ICredentialType {
	name = 'podioAppApi';

	displayName = 'Podio App API';

	documentationUrl = 'generic';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'hidden',
			typeOptions: {
				expirable: true,
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Redirect URL',
			name: 'redirect_url',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			default: '',
		},
		{
			displayName: 'App ID',
			name: 'appId',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'App Token',
			name: 'appToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			required: true,
			default: '',
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const { access_token } = (await this.helpers.httpRequest({
			method: 'POST',
			url: 'https://api.podio.com/oauth/token/v2',
			body: {
				redirect_url: credentials.redirectUrl,
				client_id: credentials.clientId,
				client_secret: credentials.clientSecret,
				app_id: credentials.appId,
				app_token: credentials.appToken,
				grant_type: 'app',
			},
			headers: {
				'Content-Type': 'application/json',
			},
		})) as {
			access_token: string;
			token_type: string;
			expires_in: number;
			refresh_token: string;
			ref: {
				type: string;
				id: number;
			};
			scope: string;
		};
		return { accessToken: access_token };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};
}
