import {
    submitDataKyc,
    submitFileKyc
} from '../requests'

export const postDataKyc = async(data) =>{
    return submitDataKyc(data)
}

export const putFileKyc = async(data) =>{
    return submitFileKyc(data)
}