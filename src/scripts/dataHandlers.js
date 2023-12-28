import Axios from "axios";
import { checkArguments, createAccountToken, createChangePasswordToken } from "./utils";
import { countries } from "../scripts/countries";
import { API_Server_Number } from "../configs/config_settings.json";

let API_Server = "";

if (API_Server_Number === 1) {
	API_Server = "https://suite.icareus.com";
} else if (API_Server_Number === 2) {
	API_Server = "https://dvcf59enpgt5y.cloudfront.net";
}

// Get all category names and id:s
const getCategories = async (organizationId, key, lang, user) => {
	if (checkArguments(organizationId, key, lang)) {
		try {
			const catResponse = await Axios.get(
				`${API_Server}/api/archive?action=getGroups&organizationId=${organizationId}&userId=${
					user?.userId || 0
				}&userToken=${user?.userToken || ""}&languageId=${lang}&token=${key}&groupTypeName=Folders`
			);
			console.log("getCategories: ", catResponse);
			return catResponse.data.groupItems;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get assets that are listed in groupItemId -string
const getSeries = async (organizationId, key, languageId, user, assetProperty, source) => {
	if (checkArguments(organizationId, key, languageId)) {
		try {
			const seriesResponse = await Axios.get(`${API_Server}/api/archive?action=getGroups`, {
				cancelToken: source.token,
				params: {
					organizationId,
					languageId,
					groupTypeName: "Series",
					...(user?.userId ? { userId: user?.userId } : {}),
					...(user?.userToken ? { userToken: user?.userToken } : {}),
					...(assetProperty ? { assetProperty: assetProperty } : {}),
				},
			});

			console.log("getSeries: ", seriesResponse);
			return seriesResponse.data.groupItems;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get subCategories with groupItemId string (single or separated by comma)
const getSubCategories = async (organizationId, token, groupItemIds, languageId, user, source) => {
	if (checkArguments(organizationId, token, groupItemIds, languageId)) {
		try {
			const catResponse = await Axios.get(`${API_Server}/api/archive?action=getGroup`, {
				cancelToken: source.token,
				params: {
					organizationId,
					languageId,
					token,
					groupItemIds,
					showHidden: true,
					...(user?.userId ? { userId: user.userId } : { userId: 0 }),
					...(user?.userToken ? { userToken: user.userToken } : { userToken: "" }),
					//...(assetProperty ? { assetProperty: assetProperty} : {assetProperty: ""}),
				},
			});
			console.log("getSubCategories: ", catResponse);
			return catResponse.data.data;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get subCategories with groupItemId string (single or separated by comma)
const getSeriesGroup = async (organizationId, groupItemIds, languageId, user, source) => {
	if (checkArguments(organizationId, groupItemIds, languageId)) {
		try {
			const catResponse = await Axios.get(`${API_Server}/api/archive?action=getGroup`, {
				cancelToken: source.token,
				params: {
					organizationId,
					languageId,
					groupItemIds,
					groupTypeName: "Series",
					...(user?.userId ? { userId: user.userId } : { userId: 0 }),
					...(user?.userToken ? { userToken: user.userToken } : { userToken: "" }),
					//...(assetProperty ? { assetProperty: assetProperty} : {assetProperty: ""}),
				},
			});
			console.log("getSeriesGroup: ", catResponse);
			return catResponse.data.data;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get all category names and id:s with root category id
const getRootSubCategories = async (organizationId, key, languageId, groupItemId, user, source) => {
	if (checkArguments(organizationId, groupItemId, key, languageId, groupItemId)) {
		try {
			const catResponse = await Axios.get(`${API_Server}/api/archive?action=getGroups`, {
				cancelToken: source.token,
				params: {
					organizationId,
					languageId,
					groupItemId,
					token: key,
					...(user?.userId ? { userId: user.userId } : { userId: 0 }),
					...(user?.userToken ? { userToken: user.userToken } : { userToken: "" }),
					//...(assetProperty ? { assetProperty: assetProperty} : {assetProperty: ""}),
				},
			});
			console.log("getRootSubCategories: ", catResponse);
			return catResponse.data.groupItems;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get assets that are listed in groupItemId -string
const getAssets = async (
	organizationId,
	groupItemId,
	token,
	languageId,
	assetProperty,
	user,
	source
) => {
	if (checkArguments(organizationId, groupItemId, token, languageId)) {
		try {
			const itemResponse = await Axios.get(`${API_Server}/api/publishing/getAssets?version=06`, {
				cancelToken: source.token,
				params: {
					organizationId,
					languageId,
					groupItemId,
					token,
					...(user?.userId ? { userId: user?.userId } : {}),
					...(user?.userToken ? { userToken: user?.userToken } : {}),
					...(assetProperty ? { assetProperty: assetProperty } : {}),
				},
			});
			console.log("getAssets: Editor ", itemResponse);
			return itemResponse.data.assets;
		} catch (err) {
			console.log(err);
		}
	}
};

// get upcomingEvents based on currentTime
const getUpcomingEvents = async (organizationId, limit, from, to) => {
	try {
		const currentTime = Date.now();
		let url = `${API_Server}/api/events?action=getEvents&version=02&organizationId=${organizationId}&end=${limit}`;

		if (from && !to) {
			url = `${url}&from=${from}`;
		}

		if (from && to) {
			url = `${url}&from=${from}&to=${to}`;
		}
		if (!from && !to) {
			url = `${url}&from=${currentTime}`;
		}

		const res = await Axios.get(url);
		console.log(`res upcoming eventsbeta`, res);

		return res;
	} catch (error) {
		console.log(error);
	}
};

// get upcomingEvents based on currentTime
const getLiveNowEvents = async (organizationId) => {
	try {
		let url = `${API_Server}/api/events?action=getLiveEvents&organizationId=${organizationId}&includeSubOrganizationEvents=true`;

		const res = await Axios.get(url);
		console.log(`getLiveNowEvents: `, res);

		return res;
	} catch (error) {
		console.log(error);
	}
};

// Get all events
const getAllEvents = async (organizationId, categoryId, limit, from, to) => {
	try {
		let url;
		if (categoryId) {
			url = `${API_Server}/api/events?action=getEvents&version=02&organizationId=${organizationId}&categoryIds=${categoryId}&end=${limit}`;
		} else {
			url = `${API_Server}/api/events?action=getEvents&version=02&organizationId=${organizationId}&end=${limit}`;
		}
		if (from && !to) {
			url = `${url}&from=${from}`;
		}

		if (from && to) {
			url = `${url}&from=${from}&to=${to}`;
		}

		const res = await Axios.get(url);

		return res;
	} catch (error) {
		console.log(error);
	}
};
// Get all events
const getAllEventsBeta = async (organizationId, categoryId, limit, from, to) => {
	try {
		let url;
		if (categoryId) {
			url = `https://suiterc.icareus.com/api/events?action=getEvents&version=02&organizationId=${organizationId}&categoryIds=${categoryId}&end=${limit}`;
		} else {
			url = `https://suiterc.icareus.com/api/events?action=getEvents&version=02&organizationId=${organizationId}&end=${limit}`;
		}
		if (from && !to) {
			url = `${url}&from=${from}`;
		}

		if (from && to) {
			url = `${url}&from=${from}&to=${to}`;
		}

		const res = await Axios.get(url);

		return res;
	} catch (error) {
		console.log(error);
	}
};

const getSingleEvent = async (organizationId, eventId) => {
	try {
		const res = await Axios.get(
			`${API_Server}/api/events?action=getEvent&version=02&organizationId=${organizationId}&eventId=${eventId}`
		);
		console.log(res);
		return res.data;
	} catch (error) {}
};

const getUpcomingEventsBeta = async (organizationId, limit, from, to) => {
	try {
		const currentTime = Date.now();
		let url = `https://suiterc.icareus.com/api/events?action=getEvents&version=02&organizationId=${organizationId}&end=${limit}`;

		if (from && !to) {
			url = `${url}&from=${from}`;
		}

		if (from && to) {
			url = `${url}&from=${from}&to=${to}`;
		}
		if (!from && !to) {
			url = `${url}&from=${currentTime}`;
		}

		const res = await Axios.get(url);
		console.log(`res upcoming eventsbeta`, res);

		return res;
	} catch (error) {
		console.log(error);
	}
};
const getEventsCategoriesBeta = async (organizationId) => {
	try {
		const res = await Axios.get(
			`https://suiterc.icareus.com/api/events?action=getCategories&version=02&organizationId=${organizationId}`
		);
		return res;
	} catch (error) {
		console.log(error);
	}
};

const getEventsCategories = async (organizationId) => {
	try {
		const res = await Axios.get(
			`${API_Server}/api/events?action=getCategories&version=02&organizationId=${organizationId}`
		);
		return res;
	} catch (error) {
		console.log(error);
	}
};

const getChannels = async (organizationId, secret) => {
	try {
		// const res = await Axios.get(
		//   `https://suite.icareus.com/api/organization?action=getOrganization&version=04&organizationId=69922&includeSubOrganizations=true`
		// );
		let token = secret;
		const res = await Axios.get(
			`${API_Server}/api/organization?action=getOrganization&version=04&organizationId=${organizationId}&includeSubOrganizations=true&token=${token}`
		);
		return res;
	} catch (error) {
		console.log(error);
	}
};

const getChannelStatus = async (organizationId, channelID) => {
	try {
		const res = await Axios.get(
			`${API_Server}/api/channels?action=getChannel&version=04&organizationId=${organizationId}&lcId=${channelID}`
		);
		return res.data.access;
	} catch (error) {
		console.log(error);
	}
};
const getChannelsBeta = async (organizationId, secret) => {
	try {
		// const res = await Axios.get(
		//   `https://suiterc.icareus.com/api/organization?action=getOrganization&version=04&organizationId=3409909&includeSubOrganizations=true`
		// );
		let token = secret ? secret : "tNtSx9xU06";
		const res = await Axios.get(
			`https://suiterc.icareus.com/api/organization?action=getOrganization&version=04&organizationId=${organizationId}&includeSubOrganizations=true&token=${token}`
		);
		return res;
	} catch (error) {
		console.log(error);
	}
};

// Get items that are listed in groupItemId -string
const getSimilar = async (organizationId, groupItemId, token, lang, assetProperty, user) => {
	if (checkArguments(organizationId, groupItemId, token, lang, assetProperty)) {
		try {
			const itemResponse = await Axios.get(
				`${API_Server}/api/publishing/getAssets?version=06&organizationId=${organizationId}&userId=${
					user?.userId || 0
				}&userToken=${user?.userToken || ""}&assetProperty=${
					assetProperty || ""
				}&orderBy=publishStart&limit=10&languageId=${lang}&groupItemId=${groupItemId}&token=${token}`
			);
			console.log("getSimilar: ", itemResponse);
			return itemResponse.data.assets;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get items that are listed in groupItemId -string
const getAsset = async (organizationId, assetId, token, lang, assetProperty, user) => {
	if (checkArguments(organizationId, assetId, token, lang)) {
		try {
			const itemResponse = await Axios.get(
				`${API_Server}/api/publishing/getAsset?version=03&organizationId=${organizationId}&userId=${
					user?.userId || 0
				}&userToken=${user?.userToken || ""}&assetProperty=${
					assetProperty || ""
				}&languageId=${lang}&assetId=${assetId}&token=${token}`
			);
			console.log("getAsset: ", itemResponse);
			return itemResponse.data;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get serie episodes
const getEpisodes = async (
	organizationId,
	groupItemId,
	token,
	languageId,
	assetProperty,
	user,
	source
) => {
	if (checkArguments(organizationId, groupItemId, token, languageId)) {
		try {
			const episodeResponse = await Axios.get(
				`${API_Server}/api/publishing?action=getAssets&version=06`,
				{
					cancelToken: source.token,
					params: {
						organizationId,
						languageId,
						token,
						groupItemId,
						series: false,
						...(user?.userId ? { userId: user.userId } : { userId: 0 }),
						...(user?.userToken ? { userToken: user.userToken } : { userToken: "" }),
						...(assetProperty ? { assetProperty: assetProperty } : { assetProperty: "" }),
					},
				}
			);
			console.log("getEpisodes: ", episodeResponse);
			return episodeResponse.data.assets;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get promoted content
const getPromo = async (
	organizationId,
	groupItemId,
	token,
	languageId,
	assetProperty,
	user,
	source
) => {
	if (checkArguments(organizationId, groupItemId, token, languageId)) {
		try {
			const promoResponse = await Axios.get(
				`${API_Server}/api/publishing?action=getAssets&version=05`,
				{
					cancelToken: source.token,
					params: {
						organizationId,
						languageId,
						token,
						groupItemId,
						series: false,
						orderBy: "publishStart",
						limit: 4,
						...(user?.userId ? { userId: user.userId } : { userId: 0 }),
						...(user?.userToken ? { userToken: user.userToken } : { userToken: "" }),
						...(assetProperty ? { assetProperty: assetProperty } : { assetProperty: "" }),
					},
				}
			);
			console.log("getPromo: ", promoResponse);
			return promoResponse.data.assets;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get banner items
const getBanner = async (organizationId, groupItemId, token, languageId, user, source) => {
	if (checkArguments(organizationId, groupItemId, token, languageId)) {
		try {
			const bannerResponse = await Axios.get(
				`${API_Server}/api/publishing?action=getBanners&version=05`,
				{
					cancelToken: source.token,
					params: {
						organizationId,
						languageId,
						token,
						groupItemId,
						series: false,
						...(user?.userId ? { userId: user.userId } : { userId: 0 }),
						...(user?.userToken ? { userToken: user.userToken } : { userToken: "" }),
						//...(assetProperty ? { assetProperty: assetProperty } : { assetProperty: "" }),
					},
				}
			);
			console.log("getBanner: ", bannerResponse);
			return bannerResponse.data.assets;
		} catch (err) {
			console.log(err);
		}
	}
};

// Authenticate user
const authenticateUser = async (organizationId, email, password) => {
	try {
		const authResponse = await Axios.get(
			`${API_Server}/api/login?action=authenticate&organizationId=${organizationId}&eMail=${email}&password=${password}`
		);
		console.log("Authentication: ", authResponse);
		return authResponse;
	} catch (err) {
		console.log(err);
	}
};

// Register user
const registerUser = async (organizationId, inputs) => {
	try {
		const registerResponse = await Axios.get(`${API_Server}/api/register?action=addSubscriber`, {
			params: {
				organizationId,
				emailAddress: inputs?.EMAIL?.value,
				userPassword: inputs?.PASSWORD?.value,
				...(inputs?.PHONE?.value ? { phoneNumber: inputs?.PHONE?.value } : {}),
				...(inputs?.CITY?.value ? { cityName: inputs?.CITY?.value } : {}),
				...(inputs?.DATEOFBIRTH?.value ? { dateOfBirth: inputs?.DATEOFBIRTH?.value } : {}),
				...(inputs?.COUNTRY?.value
					? {
							countryId: countries.find((country) => country.name === inputs?.COUNTRY?.value).id,
					  }
					: {}),
				...(inputs?.FIRSTNAME?.value ? { firstName: inputs?.FIRSTNAME?.value } : {}),
				...(inputs?.LASTNAME?.value ? { lastName: inputs?.LASTNAME?.value } : {}),
				...(inputs?.ADDRESS?.value ? { address1: inputs?.ADDRESS?.value } : {}),
			},
		});

		console.log("Register: ", registerResponse);
		return registerResponse;
	} catch (err) {
		console.log(err);
	}
};

const changePassword = async (
	organizationId,
	key,
	userId,
	newPassword,
	confirmPassword,
	oldPassword,
	userToken
) => {
	const token = createChangePasswordToken(
		organizationId,
		key,
		userId,
		newPassword,
		confirmPassword
	);

	try {
		// TODO: API CHANGES TO PASSWORD CHANGE REQUEST
		const changePasswordResponse = await Axios.get(
			`${API_Server}/api/user?action=changePassword&organizationId=${organizationId}&userId=${userId}&newPassword=${newPassword}&confirmPassword=${confirmPassword}&token=${token}&oldPassword=${oldPassword}&userToken=${userToken}`
		);

		console.log("ChangePassword: ", changePasswordResponse);
		return changePasswordResponse;
	} catch (err) {
		console.log(err);
		return err;
	}
};

// Update user
const updateUser = async (
	userId,
	userToken,
	organizationId,
	key,
	firstName,
	lastName,
	phoneNumber,
	countryId,
	regionId,
	cityName,
	postalCode,
	eMail
) => {
	const token = createAccountToken(
		userId,
		organizationId,
		key,
		firstName,
		lastName,
		phoneNumber,
		countryId,
		regionId,
		cityName,
		postalCode
	);

	try {
		const updateResponse = await Axios.get(
			`${API_Server}/api/user?action=updateUser&organizationId=${organizationId}&userToken=${userToken}&firstName=${firstName}&lastName=${lastName}&emailAddress=${eMail}&countryId=${countryId}&regionId=${regionId}&postalCode=${postalCode}&cityName=${cityName}&phoneNumber=${phoneNumber}&token=${token}`
		);
		console.log("updateUser: ", updateResponse);
		return updateResponse;
	} catch (err) {
		console.log(err);
	}
};
// get Latest Assets
const getLatestAssets = async (organizationId, token, languageId, limit) => {
	if (checkArguments(organizationId, token, languageId)) {
		try {
			const itemResponse = await Axios.get(
				`${API_Server}/api/publishing?organizationId=${organizationId}&languageId=${languageId}&limit=${
					limit ? limit : 10
				}&onlyVideos=true&action=getLatestAssets&token=${token}`
			);
			console.log("get latest Asset: ", itemResponse);
			return itemResponse.data;
		} catch (err) {
			console.log(err);
		}
	}
};
const getTrendingAssets = async (organizationId, token, languageId, limit, days) => {
	if (checkArguments(organizationId, token, languageId)) {
		try {
			const res = await Axios.get(
				`${API_Server}/api/publishing?organizationId=${organizationId}&amount=${
					limit ? limit : 10
				}&days=${days ? days : 7}0&onlyVideos=true&action=getMostPopular&token=${token}`
			);
			console.log("get trending Asset: ", res);
			const res1 = res.data.assets.map((el) => el.asset);

			return res1;
		} catch (err) {
			console.log(err);
		}
	}
};
// Get user data
const getUser = async (userToken, organizationId) => {
	try {
		const getUserResponse = await Axios.get(
			`${API_Server}/api/user?action=getUserProfile&organizationId=${organizationId}&userToken=${userToken}`
		);
		console.log("getUser: ", getUserResponse);
		return getUserResponse;
	} catch (err) {
		console.log(err);
	}
};

// Get user data
const searchAssets = async (keyword, user, organizationId, language) => {
	try {
		const getSearchResponse = await Axios.get(
			`${API_Server}/api/search/assets?action=searchAssets`,
			{
				params: {
					organizationId,
					keyword: keyword,
					...(user?.userToken ? { userToken: user?.userToken } : {}),
					...(language ? { language: language } : {}),
					...(user?.userId ? { userId: user?.userId } : {}),
				},
			}
		);

		console.log("searchAsset: ", getSearchResponse);
		return getSearchResponse;
	} catch (err) {
		console.log(err);
	}
};

const getPlayerConfig = async (organizationId, channelID) => {
	try {
		const res = await Axios.get(
			`${API_Server}/api/applications?action=getAppConfig&appId=133485121`
		);
		return res.data;
	} catch (error) {
		console.log(error);
	}
};

// Get organizations packages based on given object (if no object given it will fetch all packages)
const getPackages = async (organizationId, lang, objectId, userToken) => {
	API_Server = "https://suite.icareus.com";

	if (checkArguments(organizationId, lang)) {
		try {
			const params = {
				action: "getPackages",
				organizationId,
				// languageId: lang,
			};
			if (objectId > 0) {
				params.objectId = objectId;
			}
			if (userToken) {
				params.userToken = userToken;
			}
			const packagesResponse = await Axios.get(`${API_Server}/api/packages`, {
				params,
			});
			console.log("Org packages: ", packagesResponse);
			return packagesResponse.data;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get all shopping categories for organization
const getShoppingCategories = async (organizationId, lang) => {
	if (checkArguments(organizationId, lang)) {
		try {
			const params = {
				action: "getShoppingCategories",
				organizationId,
			};
			const shoppingCategoriesResponse = await Axios.get(`${API_Server}/api/packages`, { params });
			console.log("Shopping Cats: ", shoppingCategoriesResponse);
			return shoppingCategoriesResponse.data;
		} catch (err) {
			console.log(err);
		}
	}
};

// Get organizations payment methods
const getPaymentMethods = async (organizationId) => {
	API_Server = "https://suite.icareus.com";

	try {
		const params = {
			action: "getPaymentMethods",
			organizationId,
		};
		const paymentMethodsResponse = await Axios.get(`${API_Server}/api/payment/methods`, { params });
		console.log("Payment methods: ", paymentMethodsResponse);
		return paymentMethodsResponse.data;
	} catch (err) {
		console.log(err);
	}
};

//get payment url
const getPaymentUrl = async (
	userToken,
	organizationId,
	packageId,
	paymentMethodId,
	userEmail,
	handlerUrl
) => {
	try {
		const params = {
			action: "initPurchase",
			organizationId,
			packageId,
			paymentMethodId,
			userEmail,
			handlerUrl,
			quanity: 1,
		};
		// API_Server = 'https://my.icareus.com';
		const paymentUrlResponse = await Axios.get(
			`${API_Server}/api/purchase?action=initPurchase&organizationId=${organizationId}&packageId=${packageId}&paymentMethodId=${paymentMethodId}&userEmail=${userEmail}&handlerUrl=${handlerUrl}&quantity=1`
		);

		console.log("Url", paymentUrlResponse);
		return paymentUrlResponse.data;
	} catch (err) {
		console.log(err);
	}
};

// return from bambora payment
const purchasePackage = async (userToken, oldParams) => {
	try {
		let params = oldParams;
		params.userToken = userToken;
		params.action = "return";

		const purchasePackageResponse = await Axios.get(`${API_Server}/api/purchase/return`, {
			params,
		});

		console.log("PP: ", purchasePackageResponse);
		return purchasePackageResponse.data;
	} catch (err) {
		console.log(err);
	}
};

// Try to make Voucher purchase
const voucherPurchase = async (
	userToken,
	languageId,
	organizationId,
	productId,
	voucherCode,
	quantity,
	usedByEmail
) => {
	try {
		const params = {
			// userToken,
			action: "activateVoucher",
			voucherCode,
			languageId,
			productId,
			usedDate: new Date().getTime(),
			organizationId,
			quantity,
			usedByEmail,
		};
		console.log("PAR: ", params);
		const voucherPurchaseResponse = await Axios.get(`${API_Server}/api/purchase`, { params });
		console.log("VPR: ", voucherPurchaseResponse);
		return voucherPurchaseResponse;
	} catch (err) {
		console.log(err);
	}
};

// checking ticket number
const checkTicketNumber = async (eventId, ticketNumber) => {
	const paymentUrlResponse = await Axios.get(
		`${API_Server}/api/events/access?action=eventAccess&eventId=${eventId}&ticket=${ticketNumber}`
	);
	console.log(`checkTicket`, paymentUrlResponse);
	return paymentUrlResponse;
};

export {
	getCategories,
	getPlayerConfig,
	getRootSubCategories,
	getSubCategories,
	getSeries,
	getLiveNowEvents,
	getEventsCategories,
	getSingleEvent,
	getAllEvents,
	getEventsCategoriesBeta,
	getAllEventsBeta,
	getChannelsBeta,
	getUpcomingEventsBeta,
	getChannels,
	getUpcomingEvents,
	getAssets,
	getSimilar,
	getAsset,
	getEpisodes,
	getPromo,
	getBanner,
	getUser,
	authenticateUser,
	changePassword,
	registerUser,
	searchAssets,
	updateUser,
	getSeriesGroup,
	getChannelStatus,
	getLatestAssets,
	getTrendingAssets,
	voucherPurchase,
	getShoppingCategories,
	getPackages,
	getPaymentUrl,
	purchasePackage,
	getPaymentMethods,
	checkTicketNumber,
};
