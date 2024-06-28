const ProductListCp = artifacts.require('./ProductListCp.sol')

contract('ProductListCp', (accounts) => {
    before(async () => {
        this.productListCp = await ProductListCp.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.productListCp.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    /*it('lists tasks', async () => {
        const productCountCp = await this.productListCp.productCountCp()
        const productCp = await this.productListCp.productsCp(productCountCp)
        assert.equal(productCp.id.toNumber(), productCount.toNumber())
        assert.equal(product.name, 'Phone')
        assert.equal(product.description, 'Iphone X')
        assert.equal(product.category, 'IOS')
        assert.equal(product.price.toNumber(), 1200)
        assert.equal(productCount.toNumber(), 1)
    })*/

    /*it('creates tasks', async () => {
        const result = await this.productList.createProduct('TV', 'Samsung 42P', 'TV x', 1500)
        const productCount = await this.productList.productCount()
        assert.equal(productCount, 2)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.name, 'TV')
        assert.equal(event.description, 'Samsung 42P')
    })*/

    /*it('toggles task completion', async () => {
        const result = await this.todoList.toggleCompleted(1)
        const task = await this.todoList.tasks(1)
        assert.equal(task.completed, true)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 1)
        assert.equal(event.completed, true)
    })*/
})