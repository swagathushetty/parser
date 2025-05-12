const Spec = [
    //whitespaces
    [/^\s+/,null],

    //skip single line comment
    [/^\/\/.*/,null],

    //symbols,delimiters
    [/^;/,';'],
    [/^\{/,'{'],
    [/^\}/,'}'],
    [/^\(/,'('],
    [/^\)/,')'],

    [/^\d+/,'NUMBER'],
    [/^\w+/,'IDENTIFIER'],

    //assignment operators +=,-=,/=,*=,= 
    [/^=/,'SIMPLE_ASSIGN'],
    [/^[\*\/\+\-]=/,'COMPLEX_ASSIGN'],

    //skip multi line comment
    [/^\/\*[\s\S]*?\*\//,null],

    //math operators
    [/^[+\-]/,'ADDITIVE_OPERATOR'],
    [/^[*\/]/,'MULTIPLICATIVE_OPERATOR'],

   
    [/^"[^"]*"/,'STRING'],
    [/^'[^']*'/,'STRING']
]


class Tokenizer {

    init(string){
        this._string = string
        this._cursor = 0   
    }

    isEOF(){
        return this._cursor === this._string.length
    }


    hasMoreTokens(){
        return this._cursor < this._string.length
    }

    getNextToken(){
        if(!this.hasMoreTokens()){
            return null
        }

        const string = this._string.slice(this._cursor)
        
        for (const [regexExp,tokenType] of Spec){
            const tokenValue = this._match(regexExp,string)

            if(tokenValue == null){
                continue
            }

            //whitespace/comment detected
            if(tokenType == null){
                return this.getNextToken()
            }

            return {
                type: tokenType,
                value:tokenValue
            }
        }

        throw new Error(`Unexpected token ${string[0]}`)


        //match numbers
        // let matched = /^\d+/.exec(string)
        // if (matched !== null){
        //     this._cursor += matched[0].length
        //     return {
        //         type:'NUMBER',
        //         value:matched[0]
        //     }
        // }
        // if(!Number.isNaN(Number(string[0]))){
        //     let number = ''
        //     while(!Number.isNaN(Number(string[this._cursor]))){
        //         number += string[this._cursor++]
        //     }
        //     return {
        //         type:"NUMBER",
        //         value:number
        //     }
        // }
        // matched = /"[^"]*"/.exec(string)
        // if(matched !== null){
        //     this._cursor = matched[0].length
        //     return {
        //         type:'STRING',
        //         value:matched[0]
        //     }
        // }

        //single quote strings matching
        // matched = /'[^']*'/.exec(string)
        // if(matched !== null){
        //     this._cursor = matched[0].length
        //     return {
        //         type:'STRING',
        //         value:matched[0]
        //     }
        // }
        // if(string[0] === '"'){

        //     let s = ''
        //     do {
        //         s += string[this._cursor++]
        //     }
        //     while(string[this._cursor] !== '"' && !this.isEOF()){
        //         s += this._cursor++ //skip
        //         return {
        //             type:'STRING',
        //             value:s
        //         }
        //     }
        // }
        // return null
    }

    _match(regexExp,string){
        const matched = regexExp.exec(string)

        if(matched === null){
            return null
        }

        this._cursor += matched[0].length
        return matched[0]
    }
}


module.exports = {
    Tokenizer
}