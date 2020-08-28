const { default: Axios } = require("axios")

function getId(idProv, idStudent){

    if(idProv.length === 1){
        idProv = '0' + idProv
    }

    while(idStudent.length < 6){
        idStudent = '0' + idStudent
    }

    return idProv + idStudent
}

async function getMaxIdOfProv (idProv, left, right){

    const mid = Math.round((left + right) / 2)

    const idStudent = getId(idProv + '', mid + '')
    const idStudent_2 = getId(idProv + '', mid + 1 + '')

    if(left === right || mid === right)
        return right

    await Axios.get(`https://diemthi.vnanet.vn/Home/SearchBySobaodanhFile?code=${idStudent}&nam=2020`)
    .then(async res => {

        await Axios.get(`https://diemthi.vnanet.vn/Home/SearchBySobaodanhFile?code=${idStudent_2}&nam=2020`)
        .then(res => {
            console.log("2:" + idStudent_2 + " " + res.data.message)
            if(res.data.message != 'success'){
                return mid
            }
        })

        console.log("1:" + idStudent + " " + res.data.message)

        if(res.data.message === 'success'){
            left = mid
            //console.log(left)

        } else {
            right = mid
            //console.log(right)
        }
    })

    console.log(mid, left, right)

    return getMaxIdOfProv(idProv, left, right)
}

async function testFunc (){

    const res = await getMaxIdOfProv(50, -1, 100000)

    console.log("Res: " + res)
}

module.exports = { getId, getMaxIdOfProv }