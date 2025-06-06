/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Film = "film",
	Personne = "personne",
	Role = "role",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type FilmRecord = {
	created?: IsoDateString
	duree?: number
	id: string
	langue?: string
	produit_par?: RecordIdString
	realise_par?: RecordIdString[]
	roles?: RecordIdString[]
	synopsis?: HTMLString
	titre?: string
	updated?: IsoDateString
}

export enum PersonneNationaliteOptions {
	"US" = "US",
	"FR" = "FR",
	"UK" = "UK",
}

export enum PersonneProfessionOptions {
	"Réalisateur" = "Réalisateur",
	"Scénariste" = "Scénariste",
	"Acteur" = "Acteur",
}
export type PersonneRecord = {
	created?: IsoDateString
	date_deces?: IsoDateString
	date_naissance?: IsoDateString
	id: string
	lieu_naissance?: string
	nationalite?: PersonneNationaliteOptions
	nom?: string
	profession?: PersonneProfessionOptions[]
	updated?: IsoDateString
}

export type RoleRecord = {
	acteur?: RecordIdString
	created?: IsoDateString
	id: string
	nom_role?: string
	updated?: IsoDateString
}

export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type FilmResponse<Texpand = unknown> = Required<FilmRecord> & BaseSystemFields<Texpand>
export type PersonneResponse<Texpand = unknown> = Required<PersonneRecord> & BaseSystemFields<Texpand>
export type RoleResponse<Texpand = unknown> = Required<RoleRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	film: FilmRecord
	personne: PersonneRecord
	role: RoleRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	film: FilmResponse
	personne: PersonneResponse
	role: RoleResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'film'): RecordService<FilmResponse>
	collection(idOrName: 'personne'): RecordService<PersonneResponse>
	collection(idOrName: 'role'): RecordService<RoleResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}