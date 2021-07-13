const bcrypt = require('bcrypt')
const knex = require('../conexao')
const { schemaCadastroUsuario, schemaAtualizarUsuario } = require('../validacoes/schemas')

const cadastrarUsuario = async (req, res) => {

  const { nome, email, senha, nome_loja } = req.body

  try {

    await schemaCadastroUsuario.validate(req.body)

    const quantidadeUsuarios = await knex('usuarios').where('email', email)

    if (quantidadeUsuarios > 0) {

      return res.status(400).json("O email já existe")
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const usuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada, nome_loja })

    if (usuario === 0) {

      return res.status(400).json("O usuário não foi cadastrado.")
    }

    return res.status(200).json("O usuario foi cadastrado com sucesso!")

  } catch (error) {

    return res.status(400).json(error.message)
  }
}

const obterPerfil = async (req, res) => {

  return res.status(200).json(req.usuario)
}

const atualizarPerfil = async (req, res) => {

  const { nome, email, senha, nome_loja } = req.body

  if (!nome && !email && !senha && !nome_loja) {
        
    return res.status(404).json('É obrigatório informar ao menos um campo para atualização')   
  }
  

  try {
      
    await schemaAtualizarUsuario.validate(req.body)

    const usuarioAtualizado = await knex('usuarios').where('id', req.usuario.id).update({ nome, email, senha, nome_loja })
    
    if (usuarioAtualizado === 0) {
          
      return res.status(400).json("O usuario não foi atualizado")    
    }
    return res.status(200).json('Usuario foi atualizado com sucesso.')
    
  } catch (error) {
    
    return res.status(400).json(error.message)
  }
  
}

module.exports = {

  cadastrarUsuario,
  obterPerfil,
  atualizarPerfil 
}