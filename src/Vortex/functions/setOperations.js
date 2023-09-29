export function intersection(setA, setB) {
  let _intersection = new Set()
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}

/*
{
	continent: {
		country: {
			brand: [products]
		}
	}
}

	objResult = [
		...objResult, 
		'continent': {
			...objResult?.['continent'],
			country: {
				...objResult?.['continent']?.['country'],
				brands: [
					...objResult['continent']?.['country']?.['brands'], 
					brand: [
						...objResult['continent']?.['country']?.['brands']?.['brand'],
						product
					]
				]
			}
		}
	]



	objResult['continent'] = {
		...objResult?.['continent'],
		country: {
			...objResult['continent']?.['country'], 
			brand: [
				...objResult['continent']?.['country']?.['brand'], 
				country
			] 
		}
	}




*/
