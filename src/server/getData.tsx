import database from './firebase'
const data = database.ref('/').once("value").then((snapshot) => JSON.stringify(snapshot))
export default data