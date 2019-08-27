import { ErrorCode } from './error-code';
import { ErrorCodeMap } from './error-code-map';


export const authenticationErrorCodeMap: ErrorCodeMap = {
	'auth/user-disabled': ErrorCode.AUTH_USER_DISABLED,
	'auth/weak-password': ErrorCode.AUTH_WEAK_PASSWORD,
	'auth/requires-recent-login': ErrorCode.AUTH_REAUTH_REQUIRED,
	'auth/email-already-in-use': ErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
	'auth/expired-action-code': ErrorCode.AUTH_INVALID_ACTION_CODE,
	'auth/invalid-action-code': ErrorCode.AUTH_INVALID_ACTION_CODE,
	'auth/invalid-email': ErrorCode.AUTH_INVALID_DETAILS,
	'auth/user-not-found': ErrorCode.AUTH_INVALID_DETAILS,
	'auth/wrong-password': ErrorCode.AUTH_INVALID_DETAILS,
};