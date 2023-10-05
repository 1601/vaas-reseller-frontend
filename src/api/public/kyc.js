import {
    submitDataKyc,
    submitFileKyc,
    autocompleteAddress
} from '../requests'

export const postDataKyc = async(data) =>{
    return submitDataKyc(data)
}

export const putFileKyc = async(data) =>{
    return submitFileKyc(data)
}

export const autoCompleteAddress = async(data)=>{
    return autocompleteAddress(data)
}