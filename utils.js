const { default: Axios } = require("axios")

const provinces_1 = [
    "Hà Nội", "Tp Hồ Chí Minh", "Hải Phòng", "Đà Nẵng", "Hà Giang", "Cao Bằng", "Lai Châu", "Lào Cai",
    "Tuyên Quang", "Lạng Sơn", "Bắc Kạn", "Thái Nguyên", "Yên Bái", "Sơn La", "Phú Thọ", "Vĩnh Phúc",
    "Quảng Ninh", "Bắc Giang", "Bắc Ninh"]

const provinces_2 = ["Hải Dương", "Hưng Yên", "Hòa Bình", "Hà Nam", "Nam Định", "Thái Bình", "Ninh Bình",
    "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế",
    "Quảng Nam", "Quảng Ngãi", "Kon Tum", "Bình Định", "Gia Lai", "Phú Yên", "Đắk Lắk", "Khánh Hòa",
    "Lâm Đồng", "Bình Phước", "Bình Dương", "Ninh Thuận", "Tây Ninh", "Bình Thuận", "Đồng Nai", "Long An",
    "Đồng Tháp", "An Giang", "Bà Rịa- Vũng Tàu", "Tiền Giang", "Kiên Giang", "Cần Thơ", "Bến Tre", "Vĩnh Long",
    "Trà Vinh", "Sóc Trăng", "Bạc Liêu", "Cà Mau", "Điện Biên", "Đắk Nông", "Hậu Giang"]

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

module.exports = { getId, getMaxIdOfProv, provinces_1, provinces_2 }