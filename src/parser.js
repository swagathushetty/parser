const {Tokenizer} = require('./Tokenizer')

class Parser {

    constructor(){
        this._string = ''
        this._tokenizer = new Tokenizer()
    }

    //parses string into AST
    parse(string){
        this._string = string 
        this._tokenizer.init(string)
        
        //prime the tokenizer to obtain first token
        //lookahead is for predictive parsing
        this._lookahead = this._tokenizer.getNextToken()

        return this.Program()

    }


    Program(){
        return {
            type:'Program',
            body: this.StatementList()
        }
    }


    //StatementList Statement -> Statement Statement .....
    StatementList(stopLookahead = null){
        const statementList = [this.Statement()]

        while(this._lookahead != null && this._lookahead.type !== stopLookahead){
            statementList.push(this.Statement())
        }

        return statementList
    }

    //Statement
    //->ExpressionStatement 
     //->BlockStatement 
    Statement(){

        switch(this._lookahead.type){
            case ';':
                return this.EmptyStatement()
            case '{':
                return this.BlockStatement()
            default:
                return this.ExpressionStatement()
        }
       
    }

    EmptyStatement(){
        this._eat(';')

        return {
            type:'EmptyStatement'
        }
    }

    BlockStatement(){
        this._eat('{')

        const body = this._lookahead.type !== '}' ? this.StatementList('}') : []

        this._eat('}')

        return {
            type: 'BlockStatement',
            body
        }
    }

    // format - 'Expression' ';'
    ExpressionStatement(){
        const expression = this.Expression()
        this._eat(';')
        return {
            type : 'ExpressionStatement',
            expression
        }
    }

    Expression(){
        return this.Literal()
    }


    //literl ->NumericLiteral | StringLiteral
    Literal(){
        switch(this._lookahead.type){
            case 'NUMBER':
                return this.NumericLiteral()
            case 'STRING':
                return this.StringLiteral()
        }
        throw new SyntaxError(`Literal: unexpected literal production`)
    }

    StringLiteral(){
        const token = this._eat('STRING')
        return {
            type:'StringLiteral',
            value:token.value.slice(1,-1)
        }
    }

    NumericLiteral(){
        const token = this._eat('NUMBER')
        return {
            type:'NumericLiteral',
            value:Number(token.value)
        }
    }
    _eat(tokenType){
        const token = this._lookahead
        if(token == null){
            throw new SyntaxError(
                `Unexpected end of input, expected:${tokenType}`
            )
        }

        if(token.type !== tokenType){
            throw new SyntaxError(
                `Unexpected token${token.value} expected:${tokenType}`
            )
        }

        //advance to next token
        this._lookahead = this._tokenizer.getNextToken()
        return token
    }


}


module.exports = {
    Parser
}