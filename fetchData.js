const axios = require('axios')
const fs = require('fs')

const { getId, getMaxIdOfProv } = require('./utils')

/** Header CSV file output */
const cols = ['Code', 'Math', 'Literature', 'English', 'Physics', 'Chemistry',
'Biology', 'History', 'Geography', 'Civic']

let idProv = 0      // Province code
let fileName = ''

const MIN = -1      // Using for find total students register of province
const MAX = 81000

/**
 * Output: Promise (array 10 elements [Province code, 9 subScores])
 * @param {studentID : 8 chars include province code} id
 */
function fetchByStudentID (id) {

    let promise = resolve => {

        axios.get(`https://diemthi.vnanet.vn/Home/SearchBySobaodanhFile?code=${id}&nam=2020`)
        .then(res => {

            const scores = res.data
            let scoresMap = []

            if(scores.message === 'success'){

                {
                    scoresMap[0] = scores.result[0]['Code']
                    scoresMap[1] = scores.result[0]['Toan']
                    scoresMap[2] = scores.result[0]['NguVan']
                    scoresMap[3] = scores.result[0]['NgoaiNgu']
                    scoresMap[4] = scores.result[0]['VatLi']
                    scoresMap[5] = scores.result[0]['HoaHoc']
                    scoresMap[6] = scores.result[0]['SinhHoc']
                    scoresMap[7] = scores.result[0]['LichSu']
                    scoresMap[8] = scores.result[0]['DiaLi']
                    scoresMap[9] = scores.result[0]['GDCD']
                }
            }

            resolve(scoresMap)
        })

        .catch(() => resolve ([id]))
    }

    return new Promise(promise)
}

/**
 * Output: Array promise fetchByStudentID
 * @param {Province ID: 1 to 64} id
 * @param {Limit records} limit
 */
async function fetchByProvinceID(id, limit = 99999) {

    const size = await getMaxIdOfProv(id, MIN, MAX)

    const promises = Array(limit < size ? limit : size).fill(0).map((promise, index) => fetchByStudentID(getId(id + '', index + 1 + '')))

    return promises
}


/**
 * Save to CSV file output
 * Name: `${Province code}_scores_2020.csv`
 * @param {Province ID: 1 to 64} idProv
 * @param {Limit records} limit
 */
async function writeToFile (idProv, limit = 99999) {

    const promises = await fetchByProvinceID(idProv, limit)

    fs.writeFileSync(`${idProv}_scores_2020.csv`, cols.join(',') + '\n')

    Promise.all(promises.map(async each => {
        await each.then(val => {
            console.log((val.join(';')))
            fs.appendFileSync(`${idProv}_scores_2020.csv`, (val.join(',') + '\n'))
        })
    }))
}

module.exports = { writeToFile }