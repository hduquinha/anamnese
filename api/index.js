const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
// Usar variáveis de ambiente é a melhor prática para o Vercel
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '72.60.15.179',
    database: process.env.DB_NAME || 'mmn',
    password: process.env.DB_PASSWORD || '699d0855152e236c365e',
    port: process.env.DB_PORT || 5431,
    ssl: false 
});

// Create Table if not exists (Executar apenas uma vez ou manualmente seria melhor em serverless, mas deixaremos aqui por segurança)
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS anamnese_respostas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255),
        telefone VARCHAR(50),
        cidade VARCHAR(255),
        momento_atual TEXT,
        dificuldade_barreira TEXT,
        maior_medo TEXT,
        tempo_disponivel TEXT,
        visao_instituto TEXT,
        visao_futuro TEXT,
        contribuicao TEXT,
        sonhos_objetivos TEXT,
        o_que_falta TEXT,
        como_ajudar TEXT,
        renda_necessaria TEXT,
        data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Executa a criação da tabela de forma assíncrona sem bloquear o request inicial
pool.query(createTableQuery)
    .then(() => console.log("Tabela 'anamnese_respostas' verificada/criada com sucesso."))
    .catch(err => console.error("Erro ao criar tabela:", err));

// Route
app.post('/api/submit', async (req, res) => {
    const data = req.body;
    
    const query = `
        INSERT INTO anamnese_respostas (
            nome, telefone, cidade, 
            momento_atual, dificuldade_barreira, maior_medo, 
            tempo_disponivel, visao_instituto, visao_futuro, 
            contribuicao, sonhos_objetivos, o_que_falta, 
            como_ajudar, renda_necessaria
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id;
    `;

    const values = [
        data.nome,
        data.telefone,
        data.cidade,
        data.q1, // momento_atual
        data.q2, // dificuldade_barreira
        data.q_medo,
        data.q4, // tempo_disponivel
        data.q5, // visao_instituto
        data.q6, // visao_futuro
        data.q7, // contribuicao
        data.q8, // sonhos_objetivos
        data.q9, // o_que_falta
        data.q10, // como_ajudar
        data.q11 // renda_necessaria
    ];

    try {
        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Formulário enviado com sucesso!', id: result.rows[0].id });
    } catch (err) {
        console.error("Erro ao salvar dados:", err);
        res.status(500).json({ message: 'Erro ao salvar dados no servidor.' });
    }
});

// Rota padrão para verificar se a API está online
app.get('/api', (req, res) => {
    res.send('API do Formulário de Anamnese está online!');
});

module.exports = app;
