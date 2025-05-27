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
            case 'let':
                return this.VariableStatement()
            default:
                return this.ExpressionStatement()
        }
       
        
    }

    VariableStatement(){
        this._eat('let')
        const declarations = this.VariableDeclarationList()
        this._eat(';')
        return {
            type:'VariableStatement',
            declarations,

        }
    }

    VariableDeclarationList(){
        const declarations = []
        do {
            declarations.push(this.VariableDeclaration())
        }while(this._lookahead.type === ',' && this._eat(','))
        return declarations
    }

    VariableDeclaration(){

        const id = this.Identifier()
        const init = this._lookahead.type !== ';' && this._lookahead.type !== ',' ?
                        this.VariableInitialiser()
                        :
                        null

        return {
            type:'VariableDeclaration',
            id,
            init
        }
    }
    VariableInitialiser(){
        this._eat('SIMPLE_ASSIGN')
        return this.AssignmentExpression()
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


    //assignment expression has now lowest precedence. it will run first
    Expression(){
        return this.AssignmentExpression()
    }

    AssignmentExpression(){
        const left = this.AdditiveExpression()

        //if assignment expression doesnt exist return left
        if(!this._isAssignmentOperator(this._lookahead.type)){
            return left
        }

        /** 
        right:this.AssignmentExpression() handles the right-associativity of assignment operators. 
        Right-associativity means that when you have multiple assignments like a = b = c = 10, 
        they are evaluated from right to left, essentially as a = (b = (c = 10)).

        */
        return {
            type:'AssignmentExpression',
            operator:this.AssignmentOperator().value,
            left:this._checkValidAssignmentTarget(left),
            right:this.AssignmentExpression()
        }
    }
    _isAssignmentOperator(tokenType){
        return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN'
    }

    LeftHandSideExpression(){
        return this.Identifier()
    }

    Identifier(){
        const name = this._eat('IDENTIFIER').value
        return {
            type:'Identifier',
            name
        }
    }

    _checkValidAssignmentTarget(node){
        if(node.type == 'Identifier'){
            return node
        }

        throw new SyntaxError('Invalid LHS in assigment expression')
    }

    AssignmentOperator(){
        if(this._lookahead.type == 'SIMPLE_ASSIGN'){
            return this._eat('SIMPLE_ASSIGN')
        }
        return this._eat('COMPLEX_ASSIGN')
    }
    //Additive expression
    AdditiveExpression(){

        return this._BinaryExpression(
            'MultiplicativeExpression',
            'ADDITIVE_OPERATOR'
        )
    }

    MultiplicativeExpression(){

        return this._BinaryExpression(
            'PrimaryExpression',
            'MULTIPLICATIVE_OPERATOR'
        )
    }

    _BinaryExpression(builderName,operatorToken){
        let left = this[builderName]()

        while(this._lookahead.type === operatorToken){

            const operator = this._eat(operatorToken).value
            const right = this[builderName]()
            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            }
        }

        return left
    }

    PrimaryExpression(){
        
        if(this._isLiteral(this._lookahead.type)){
            return this.Literal()
        }


        switch(this._lookahead.type){
            case '(':
                return this.ParenthesizedExpression()
            default:
                return this.LeftHandSideExpression()
        }
    }

    _isLiteral(tokenType){
        return tokenType === 'NUMBER' || tokenType === 'STRING'        
    }
    /**
        '(' Expression ')'
     */
    ParenthesizedExpression(){
        this._eat('(')
        const expression = this.Expression()
        this._eat(')')
        return expression
    }

    //literl ->NumericLiteral | StringLiteral
    Literal(){
        switch(this._lookahead.type){
            case 'NUMBER':
                return this.NumericLiteral()
            case 'STRING':
                return this.StringLiteral()
        }
        console.log(this._lookahead.type)
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