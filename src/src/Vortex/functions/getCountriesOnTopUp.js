import countryOperations from 'country-list-js';
import { intersection } from './setOperations';

const countryCodes = [
  {
    country: 'China',
    data: ['133', '134', '135'],
  },
  {
    country: 'Indonesia',
    data: ['1312', '1321', '1324', '1327', '1411', '1839', '215'],
  },
  {
    country: 'India',
    data: ['1371', '1420', '1807', '1808', '2016', '368'],
  },
  {
    country: 'Brazil',
    data: ['138', '1439', '3629', '439', '610', '708', '97'],
  },
  {
    country: 'Nepal',
    data: ['1442', '1443', '2031', '3069', '3075', '3076', '3077'],
  },
  {
    country: 'Bangladesh',
    data: ['1446', '1447', '1448', '1449', '249', '2865', '2866'],
  },
  {
    country: 'Egypt',
    data: ['1451', '190', '716'],
  },
  {
    country: 'Vietnam',
    data: ['1490', '231', '3086', '396', '704'],
  },
  {
    country: 'Sri Lanka',
    data: ['1609', '360', '409'],
  },
  {
    country: 'Pakistan',
    data: ['1628', '1629', '1630', '1631', '3388'],
  },
  {
    country: 'South Korea',
    data: ['3054', '311'],
  },
  {
    country: 'Mexico',
    data: ['1606', '1607', '1601'],
  },
  {
    country: 'Portugal',
    data: ['1291', '2835', '2836', '2837', '2838', '2839'],
  },
];

const continents = [
  {
    continent: 'Asia',
    data: ['Bangladesh', 'India', 'Indonesia', 'Nepal', 'Pakistan', 'Sri Lanka', 'Vietnam'],
  },
  {
    continent: 'Europe',
    data: ['Portugal'],
  },
  {
    continent: 'North America',
    data: ['Mexico'],
  },
  {
    continent: 'South America',
    data: ['Brazil'],
  },
];

const countryList = new Set([
  'Afghanistan',
  'Albania',
  'Algeria',
  'American',
  'Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua',
  'and',
  'Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  '(the)',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bonaire,',
  'Sint',
  'Eustatius',
  'and',
  'Saba',
  'Bosnia',
  'and',
  'Herzegovina',
  'Botswana',
  'Bouvet',
  'Island',
  'Brazil',
  'British',
  'Indian',
  'Ocean',
  'Territory',
  'Brunei',
  'Darussalam',
  'Bulgaria',
  'Burkina',
  'Faso',
  'Burundi',
  'Cabo',
  'Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cayman',
  'Islands',
  'Central',
  'African',
  'Republic',
  'Chad',
  'Chile',
  'China',
  'Christmas',
  'Island',
  'Cocos',
  'Islands',
  'Colombia',
  'Comoros',
  '',
  'Congo',
  'Congo',
  'Cook',
  'Island',
  'Costa',
  'Rica',
  'Croatia',
  'Cuba',
  'Curaçao',
  'Cyprus',
  'Czechia',
  'Côte',
  "d'Ivoire",
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican',
  'Republic',
  'Ecuador',
  'Egypt',
  'El',
  'Salvador',
  'Equatorial',
  'Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Falkland',
  'Islands',
  'Faroe',
  'Islands',
  'Fiji',
  'Finland',
  'France',
  'French',
  'Guiana',
  'French',
  'Polynesia',
  'French',
  'Southern',
  'Territories',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Heard',
  'Island',
  'and',
  'McDonald',
  'Islands',
  'Holy',
  'See',
  'Honduras',
  'Hong',
  'Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Isle',
  'of',
  'Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea',
  '(the',
  'Democratic',
  "People's",
  'Republic',
  'of)',
  'South',
  'Korea',
  'Kuwait',
  'Kyrgyzstan',
  'Lao',
  "People's",
  'Democratic',
  'Republic',
  '(the)',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall',
  'Islands',
  '(the)',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New',
  'Caledonia',
  'New',
  'Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Niue',
  'Norfolk',
  'Island',
  'Northern',
  'Mariana',
  'Islands',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine,',
  'State',
  'of',
  'Panama',
  'Papua',
  'New',
  'Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Pitcairn',
  'Poland',
  'Portugal',
  'Puerto',
  'Rico',
  'Qatar',
  'Republic',
  'of',
  'North',
  'Macedonia',
  'Romania',
  'Russian',
  'Federation',
  'Rwanda',
  'Réunion',
  'Saint',
  'Barthélemy',
  'Saint',
  'Helena,',
  'Ascension',
  'and',
  'Tristan',
  'da',
  'Cunha',
  'Saint',
  'Kitts',
  'and',
  'Nevis',
  'Saint',
  'Lucia',
  'Saint',
  'Martin',
  'Saint',
  'Pierre',
  'and',
  'Miquelon',
  'Saint',
  'Vincent',
  'and',
  'the',
  'Grenadines',
  'Samoa',
  'San',
  'Marino',
  'Sao',
  'Tome',
  'and',
  'Principe',
  'Saudi',
  'Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra',
  'Leone',
  'Singapore',
  'Sint',
  'Maarten',
  'Slovakia',
  'Slovenia',
  'Solomon',
  'Islands',
  'Somalia',
  'South',
  'Africa',
  'South',
  'Georgia',
  'and',
  'the',
  'South',
  'Sandwich',
  'Islands',
  'South',
  'Sudan',
  'Spain',
  'Sri',
  'Lanka',
  'Sudan',
  'Suriname',
  'Svalbard',
  'and',
  'Jan',
  'Mayen',
  'Sweden',
  'Switzerland',
  'Syrian',
  'Arab',
  'Republic',
  'Taiwan',
  'Tajikistan',
  'Tanzania,',
  'United',
  'Republic',
  'of',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tokelau',
  'Tonga',
  'Trinidad',
  'and',
  'Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks',
  'and',
  'Caicos',
  'Islands',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United',
  'Arab',
  'Emirates',
  'United',
  'Kingdom',
  'of',
  'Great',
  'Britain',
  'and',
  'Northern',
  'Ireland',
  'United',
  'States',
  'Minor',
  'Outlying',
  'Islands',
  'United',
  'States',
  'of',
  'America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Virgin',
  'Islands',
  'Virgin',
  'Islands',
  'Wallis',
  'and',
  'Futuna',
  'Western',
  'Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe',
  'Åland',
  'Islands',
]);

/*

{
	'1628': pakistan
}
*/
const countrybrands = {}; // repository of country per speciic brand

/**
 * {
 * 	mexico: {
 * 		globe_telecom: ['']
 * 	}
 * }
 *
 */
// the brands per country is stored here
const brandPerCountry = {};

let objResult = {};

export function initializeInternationalLoad() {
  // get the brands of each country
  countryCodes.forEach((country) => {
    country.data.forEach((brandCode) => {
      countrybrands[`${brandCode}`] = country.country;
    });
  });
}

export function addToInternationalLoad(data) {
  const country = identifyTheCountry(data.name);
  const brand =
    country !== 'China'
      ? data.name.substr(0, data.name.indexOf(country))
      : `${data.name.split(' ')[0]} ${data.name.split(' ')[1]}`;
  const continent = countryOperations.findByName(country)?.continent;

  if (continent) {
    sortThruBrandCountryAndContinent(country, brand.trim(), continent, data);
  }
}

function sortThruBrandCountryAndContinent(country, brand, continent, data) {
  const d = objResult[continent]?.[country]?.brands?.[brand] ? objResult[continent]?.[country]?.brands?.[brand] : [];
  objResult = {
    ...objResult,
    [continent]: {
      ...objResult[continent],
      [country]: {
        ...objResult[continent]?.[country],
        brands: {
          ...objResult[continent]?.[country]?.brands,
          [brand]: {
            ...objResult[continent]?.[country]?.brands?.[brand],
            [data.code]: data,
          },
        },
      },
    },
  };
}

function identifyTheCountry(voucherName) {
  const voucherNameAsSet = new Set(voucherName.replaceAll('-', ' ').split(' '));
  const result = intersection(countryList, voucherNameAsSet);

  if (result.size === 0) {
    // console.log(voucherName);
    return '';
  }

  return Array.from(result).join(' ');
}

function transformBrand(brand) {
  return brand?.replaceAll(' ', '-');
}

function revertTransformation(brand) {
  return brand?.replaceAll('-', ' ');
}

function sortThruCountryAndBrand(country, brand, product) {
  const brandExist = brandPerCountry[`${country}`]?.[`${brand}`];
  if (brandExist) {
    brandPerCountry[`${country}`][`${brand}`].push(product);
  } else {
    const objectToAdd = {};
    objectToAdd[`${brand}`] = [product];
    brandPerCountry[`${country}`] = {
      ...brandPerCountry[`${country}`],
      ...objectToAdd,
    };
  }
}

export function getCountriesOnTopUp(continent) {
  return Object.keys(objResult[`${continent}`]);
}

export function getContinents() {
  // console.log('getting continents');
  return Object.keys(objResult);
}

export function getBrandsByCountry(continent, country) {
  return Object.keys(objResult[`${continent}`][`${country}`].brands);
}

export function getProductsOfBrand(continent, country, brand) {
  // console.log('get products of brand');
  // console.log(continent, country, brand);
  // console.log(objResult);
  // console.log(objResult[`${continent}`]?.[`${country}`]?.brands?.[`${brand.replaceAll('-', ' ')}`]);

  const brands = objResult[`${continent}`]?.[`${country}`]?.brands?.[`${brand.replaceAll('-', ' ')}`];

  const keys = Object.keys(brands);
  const result = [];

  for (let a = 0; a < keys.length; a += 1) {
    const key = keys[a];
    result.push(brands[key]);
  }

  // console.log(result);

  return result;
}
