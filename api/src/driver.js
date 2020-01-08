const GraphDatabase = require('neo4j-driver')

// always use bolt+routing so that your queries can served by the best instance?
// replace your connection details, username and password
const auth = GraphDatabase.auth.basic('neo4j', 'neo')
const driver = new GraphDatabase.driver('bolt://localhost:7687', auth)


function main() {
    const writeSession = driver.session(GraphDatabase.session.WRITE)

    writeSession.writeTransaction(tx => createRelationshipToPeople(tx, 'Alice', 'David'))
        .then(res => {
            res.records.forEach(row => {
                console.log(row.get('p1'), row.get('p2'))
            })
        })
        .catch(e => console.error(e))
        .then(() => writeSession.close())

    const readSession = driver.session(GraphDatabase.session.READ)

    readSession.readTransaction(tx => readPeople(tx, 'Alice'))
        .then(res => {
            return res.records.map(row => row.get('name'))
        })
        .then(names => console.log(names))
        .catch(e => console.error(e))
        .then(() => readSession.close())
}


// Run it
main();

function createRelationshipToPeople(tx, person1_name, person2_name) {
    const query = `
        MERGE (p1:Person { name: $person1_name }) 
        MERGE (p2:Person { name: $person2_name })    
        MERGE (p1)-[:KNOWS]->(p2)
        RETURN p1, p2
    `

    return tx.run(query, { person1_name, person2_name })
}

function readPeople(tx, name) {
    const query = `
        MATCH (p:Person)
        WHERE p.name = $name
        RETURN p.name AS name
    `

    return tx.run(query, { name })
}
