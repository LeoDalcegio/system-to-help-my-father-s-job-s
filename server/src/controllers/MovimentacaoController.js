const connection = require('../database/connection');

module.exports = {

    /**
     * Buscar todas as movimentações filtrando o tipo delas
     * @param  {[Number]} request.query.page Página atual
     * @param  {[Number]} request.query.limit Limite de itens por página
     * @param  {[String]} request.query.tipo "S" = saída, "E" = entrada
     * @return {[JSON]} JSON contendo todas as movimentações
     */
    async index(request, response) {
        const { page = 1, limit = 10, tipo } = request.query;
        
        try {
            const movimentacoes = await connection('movimentacao')
                .leftJoin('cliente', 'cliente.id', 'movimentacao.cliente_id')
                .leftJoin('produto', 'produto.id', 'movimentacao.produto_id')                                 
                .select(
                    'movimentacao.*', 
                    'cliente.nome', 
                    'produto.codigo_do_produto', 
                    'produto.descricao_do_produto'
                )
                .where('movimentacao.tipo', tipo)
                .limit(limit)
                .offset((page - 1) * 5);

            return response.json(movimentacoes);
        } catch (err) {
            return response.status(400).send({ error: err.message });
        }
    },

    /**
     * Buscar uma movimentação
     * @param  {[Number]} request.params.id Id da movimentação a ser retornado
     * @return {[JSON]} JSON contendo a movimentação
     */
    async show(request, response) {
        const { id } = request.params;

        try {
            const movimentacao = await connection('movimentacao')
                .leftJoin('cliente', 'cliente.id', 'movimentacao.cliente_id')
                .leftJoin('produto', 'produto.id', 'movimentacao.produto_id')                
                .select(
                    'movimentacao.*', 
                    'cliente.nome', 
                    'produto.codigo_do_produto', 
                    'produto.descricao_do_produto'
                )
                .where('movimentacao.id', id)
                .first();

            return response.json(movimentacao);
        } catch (err) {
            return response.status(400).send({ error: err.message });
        }
    },
  
    /**
     * Criar uma movimentação
     * @param  {[Number]} request.body.numero_da_nota Número da nota movimentada
     * @param  {[String]} request.body.tipo "S" = saída, "E" = entrada
     * @param  {[String]} request.body.observacao Observação para a movimentação
     * @param  {[Date]} request.body.data_da_movimentacao Data da movimentação
     * @param  {[Number]} request.body.quantidade Quantidade movimentada
     * @param  {[Number]} request.body.produto_id Produto movimentado
     * @param  {[Number]} request.body.cliente_id Cliente referente a esta movimentação
     * @return {[JSON]} JSON contendo a movimentação criada
     */
    async create(request, response) {
        const { 
            numero_da_nota, 
            tipo, 
            observacao, 
            data_da_movimentacao, 
            quantidade, 
            produto_id, 
            cliente_id 
        } = request.body;

        // criar enum para tipo e verificar se ele é válido

        let movimentacao = {
            numero_da_nota, 
            tipo, 
            observacao, 
            data_da_movimentacao, 
            quantidade, 
            produto_id, 
            cliente_id 
        };

        try {
            await connection('movimentacao')
                .insert(movimentacao)
                .then((id) => {
                    movimentacao.id = id[0];
                });

            return response.json(movimentacao);
        } catch (err) {
            return response.status(400).send({ error: err.message });
        }
    },

    /**
     * Atualizar uma movimentação
     * @param  {[Number]} request.body.numero_da_nota Número da nota movimentada
     * @param  {[String]} request.body.tipo "S" = saída, "E" = entrada
     * @param  {[String]} request.body.observacao Observação para a movimentação
     * @param  {[Date]} request.body.data_da_movimentacao Data da movimentação
     * @param  {[Number]} request.body.quantidade Quantidade movimentada
     * @param  {[Number]} request.body.produto_id Produto movimentado
     * @param  {[Number]} request.body.cliente_id Cliente referente a esta movimentação
     * @return {[JSON]} JSON contendo a movimentação atualizada
     */
    async update(request, response) {
        const { id } = request.params;

        const { numero_da_nota, tipo, observacao, data_da_movimentacao, quantidade, produto_id, cliente_id } = request.body;
        
        const movimentacao = {
            numero_da_nota,
            tipo,
            observacao,
            data_da_movimentacao, 
            quantidade, 
            produto_id, 
            cliente_id
        };

        try {
            await connection('movimentacao')
                .where('id', id)
                .update(
                    movimentacao
                );

            return response.json(movimentacao);
        } catch (err) {
            return response.status(400).send({ error: err.message });
        }
    },

    /**
     * Deletar uma movimentação
     * @param  {[Number]} request.body.nome Id da movimentação a ser excluída
     * @return {[StatusCode]} Status code da operação
     */
    async destroy(request, response) {
        const { id } = request.params;

        try {
            await connection('movimentacao')
                .where('id', id)
                .delete();

            return response.status(204).send();
        } catch (err) {
            return response.status(400).send({ error: err.message });
        }
    },
}
