const {Parser} = require('../src/Parser')
const assert = require('assert');
const parser = new Parser()

const tests = [
    require('./literals-test.js'),
    require('./block-test.js'),
    require('./empty-statement-test.js'),
    require('./math-test.js'),
]


//manual test
function exec(){

    const program = `
            /**
            Document comment
            **/

            //hello

            (2+2) * 2;
`

const ast = parser.parse(program)

console.log(JSON.stringify(ast,null,2))

}

exec()

//automated test
function test(program,expected){
    const ast = parser.parse(program)

    assert.deepEqual(ast,expected)
}


tests.forEach((testRun)=>{
    testRun(test)
})


console.log('All assertions passed !!')