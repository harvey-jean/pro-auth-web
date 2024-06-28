App = {
    loading: false,
    contracts: {},
    blockchain_uid: '',
    load: async () => {
        //Load app...
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
        web3.eth.defaultAccount = App.account
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
        console.log("Send transaction...")
      } catch (error) {
        // User denied account access...
        console.log("Error ==>"+ error)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
      console.log("Send transaction legacy...")
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    App.account = web3.eth.accounts[0]
    console.log("Account is:"+ App.account)
  },

  loadContract: async () => {
    //Create a Javascript version of the smart contract

    const productDetails = await $.getJSON('ProductDetails.json')
    App.contracts.ProductDetails = TruffleContract(productDetails)
    App.contracts.ProductDetails.setProvider(App.web3Provider)
    
    //Hydrate the smart contract with values from the blockchain
    App.productDetails = await App.contracts.ProductDetails.deployed()
  },

  render: async () => {
    //Prevent double render
    if(App.loading){
        return
    }

    //Update app loading state
    App.setLoading(true)

    //Render Account
    $('#account').html(App.account)

    // Render Products
    await App.renderProducts()

    //Update loading state
    App.setLoading(false)
  },

  renderProducts: async () => {
    //Load the total task count from the bloackchain
    //const productCount = await App.productList.productCount()
    const productCount = await App.productDetails.productCount()
    console.log("Blockchain Product Count ==> "+ productCount)
    //Render Total of products stored in Blockchain
    $('#productInBlockchainCounter').html(' '+ productCount)

    const $taskTemplate = $('.taskTemplate')
    const tableBody = document.querySelector('#tableProduct tbody');
    tableBody.innerHTML = '';
    //Render out each task with a new task template
    for(var i=1; i <= productCount; i++){
        //Fetch the task data from the Blockchain
        const product = await App.productDetails.products(i)

        const productId = product[0].toNumber()
        //name , referenceId, manufacturer, madeIn, description, category, createdBy
        const productDetails = product[1].split("|");
        const productName = productDetails[0];
        const productReferenceId = productDetails[1];
        const productManufacturer = productDetails[2];
        const productMadeIn = productDetails[3];
        const productDescription = productDetails[4];
        const productCategory = productDetails[5];
        const productCreatedBy = productDetails[6];

        const productPrice = product[2];
        const productWarranty = product[3];
        const productYearOfRelease = product[4];
        const productCreatedAt = product[5];

        const row = document.createElement('tr');
        row.innerHTML = `
          <td></td>
          <td>${productId}</td>
          <td>${productName}</td>
          <td>${productReferenceId}</td>
          <td>${productManufacturer}</td>
          <td>${productMadeIn}</td>
          <td>${productPrice}</td>
          <td>${productWarranty}</td>
          <td>${productYearOfRelease}</td>
          <td>${productDescription}</td>
          <td>${productCategory}</td>
          <td>${productCreatedBy}</td>
          <td>${productCreatedAt}</td>
        `;
        tableBody.appendChild(row);

        console.log("ProductDetails==>"+ product)
        console.log("prodId:"+ productId);
        console.log("prodName:"+ productName);
        console.log("prodReferenceId:"+ productReferenceId);
        console.log("prodManufacturer:"+ productManufacturer);
        console.log("prodMadeIn:"+ productMadeIn);
        console.log("prodDescription:"+ productDescription);
        console.log("prodCategory:"+ productCategory);
        console.log("prodCreatedBy:"+ productCreatedBy);
        console.log("prodPrice:"+ productPrice);
        console.log("prodWarranty:"+ productWarranty);
        console.log("prodYearOfRelease:"+ productYearOfRelease);
        console.log("prodCreatedAt:"+ productCreatedAt);

    }
  },

  createProduct: async () => {
    App.setLoading(true)
    const prodName = $('#prodName').val()
    const prodReference = $('#prodReference').val()
    const prodManufacturer = $('#prodManufacturer').val()
    const prodMadeIn = $('#prodMadeIn').val()
    const prodPrice = $('#prodPrice').val()
    const prodWarranty = $('#prodWarranty').val()
    const prodYearOfRelease = $('#prodYearRelease').val()
    const prodDescription = $('#prodDescription').val()
    const prodCategory = $('#prodCategory').val()
    const prodCreadtedBy = $('#prodCreatedBy').val()

    const prodDetails = prodName +"|"+ prodReference +"|"+ prodManufacturer +"|"+ prodMadeIn +"|"
                        + prodDescription +"|"+ prodCategory +"|"+ prodCreadtedBy;

    const tx_create = await App.productDetails.createProduct(prodDetails, 
                                                              prodPrice,
                                                              prodWarranty,
                                                              prodYearOfRelease);
    const uid_hash = tx_create.tx;
    const productCount = await App.productDetails.productCount();

    await App.addProductCopyDB(productCount, prodName, prodReference, 
      prodManufacturer, prodMadeIn, prodPrice, prodWarranty, prodYearOfRelease,
      prodDescription, prodCategory, prodCreadtedBy, uid_hash);
      console.log("uid:"+ uid_hash);

    window.location.reload()
  },
  searchProduct: async () => {
    //Load the total task count from the bloackchain
    var prodId = $('#prodId').val()
    //prodId = parseInt(prodId)
    //const productCountCp = await App.productListCp.productCountCp()
    var productCount = await App.productDetails.productCount();
    const $searchProductDiv = $('.tableSearchProductDiv')
    const $prodSearchTemplateNotFound = $('.prodSearchTemplateNotFound')

    const tableBody = document.querySelector('#tableProductSearch tbody');
    tableBody.innerHTML = '';

    const $qrcodeTemmplate = $('#qrcode')
    $qrcodeTemmplate.empty()
    console.log("Search="+ prodId)
    console.log("Count="+ productCount)
    //Render out each task with a new task template
    if(parseInt(prodId) > 0 && parseInt(prodId) <= parseInt(productCount)){
        console.log("Inside="+ productCount)
        //Fetch the task data from the Blockchain
        const product = await App.productDetails.products(prodId)
        const productId = product[0].toNumber()
        //name , referenceId, manufacturer, madeIn, description, category, createdBy
        const productDetails = product[1].split("|");
        const productName = productDetails[0];
        const productReferenceId = productDetails[1];
        const productManufacturer = productDetails[2];
        const productMadeIn = productDetails[3];
        const productDescription = productDetails[4];
        const productCategory = productDetails[5];
        const productCreatedBy = productDetails[6];

        const productPrice = product[2];
        const productWarranty = product[3];
        const productYearOfRelease = product[4];
        const productCreatedAt = product[5];

        const row = document.createElement('tr');
        row.innerHTML = `
          <td></td>
          <td>${productId}</td>
          <td>${productName}</td>
          <td>${productReferenceId}</td>
          <td>${productManufacturer}</td>
          <td>${productMadeIn}</td>
          <td>${productPrice}</td>
          <td>${productWarranty}</td>
          <td>${productYearOfRelease}</td>
          <td>${productDescription}</td>
          <td>${productCategory}</td>
          <td>${productCreatedBy}</td>
          <td>${productCreatedAt}</td>
        `;
        tableBody.appendChild(row);

        console.log("ProductDetails==>"+ product)
        console.log("prodId:"+ productId);
        console.log("prodName:"+ productName);
        console.log("prodReferenceId:"+ productReferenceId);
        console.log("prodManufacturer:"+ productManufacturer);
        console.log("prodMadeIn:"+ productMadeIn);
        console.log("prodDescription:"+ productDescription);
        console.log("prodCategory:"+ productCategory);
        console.log("prodCreatedBy:"+ productCreatedBy);
        console.log("prodPrice:"+ productPrice);
        console.log("prodWarranty:"+ productWarranty);
        console.log("prodYearOfRelease:"+ productYearOfRelease);
        console.log("prodCreatedAt:"+ productCreatedAt);

        const qrcodeDiv = document.getElementById("qrcode");
        
        //const product_uid_hash = App.searchProductHashByReference(productReferenceId);
        //console.log("Uid_Hash:"+ product_uid_hash)
        // Create a QR code instance with data

        await fetch('http://localhost:3001/products/search?productReference='+ productReferenceId, {
        method: 'GET',
        mode: 'cors',
        }).then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(product => {

          product.forEach(product => {
            blockchain_uid = product.uid_hash;
            console.log("TTT=>"+ blockchain_uid);

            const qr = new QRCode(qrcodeDiv, {
              text: 'P-'+ productId+ '\n'+
                    'P-'+ productReferenceId+ '\n'+
                    'P-'+ blockchain_uid,
              width: 128,
              height: 128
          });

            //return blockchain_uid;
          });
          
        })
        .catch(error => {
          console.error('Error:', error);
        });

         //Show the task
         $prodSearchTemplateNotFound.hide()
         $searchProductDiv.show()
         $qrcodeTemmplate.show()
    }else{
         $prodSearchTemplateNotFound.show()
         $searchProductDiv.hide()
         $qrcodeTemmplate.hide()
    }
  },
  searchCategory: async () =>{
  
    var catName = $('#catId').val()
    console.log("Search="+ catName)
    const $searchCategoryDiv = $('.tableSearchCategoryDiv')
    const $catSearchTemplateNotFound = $('.catSearchTemplateNotFound')

    await fetch('http://localhost:3001/categories/search?categoryname='+ catName, {
      method: 'GET',
      mode: 'cors',
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(categories => {
      console.log(categories);
      if(categories.length !== 0){
        $searchCategoryDiv.show()
        $catSearchTemplateNotFound.hide()        

        App.fillSearchCategory(categories);
      }else{
         $searchCategoryDiv.hide()
         $catSearchTemplateNotFound.show()
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
},
fillSearchCategory: async (categories) => {
    
    const tableBody = document.querySelector('#tableCategorySearch tbody');
    if(tableBody){
      // Clear existing table rows
      tableBody.innerHTML = '';
      // Iterate through each user and create a table row
      let i = 0;
      categories.forEach(category => {
        i++;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td></td>
          <td>${i}</td>
          <td>${category.categoryname}</td>
          <td>${category.categoryreference}</td>
          <td>${category.description}</td>
          <td>${category.createdBy}</td>
          <td>${category.createdAt}</td>
        `;
        tableBody.appendChild(row);
      });
    }else {
      console.error('Element with id "tableBody" not found.');
    }

  },
  searchWebUser: async () =>{
  
    var webUser = $('#webUserId').val()
    //console.log("Search="+ webUsername)
    const $searchWebUserDiv = $('.tableSearchWebUserDiv')
    const $webUserSearchTemplateNotFound = $('.webUserSearchTemplateNotFound')

    await fetch('http://localhost:3001/users/search?username='+ webUser, {
      method: 'GET',
      mode: 'cors',
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(user => {
      console.log(user);
      if(user.length !== 0){
        $searchWebUserDiv.show()
        $webUserSearchTemplateNotFound.hide()        

        App.fillSearchWebUser(user);
      }else{
         $searchWebUserDiv.hide()
         $webUserSearchTemplateNotFound.show()
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
},
fillSearchWebUser: async (user) => {
    
  const tableBody = document.querySelector('#tableWebUserSearch tbody');
  if(tableBody){
    // Clear existing table rows
    tableBody.innerHTML = '';
    // Iterate through each user and create a table row
    let i = 0;
    user.forEach(user => {
      i++;
      const row = document.createElement('tr');
      row.innerHTML = `
      <td></td>
      <td>${i}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>${user.username}</td>
      <td>${user.address}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status === true ? 'Active' : 'Inactive'}</td>
      <td>${user.createdBy}</td>
      <td>${user.createdAt}</td>
      `;
      tableBody.appendChild(row);
    });
  }else {
    console.error('Element with id "tableBody" not found.');
  }

},
searchMobUser: async () =>{
  
  var mobUser = $('#mobUserId').val()
  //console.log("Search="+ webUsername)
  const $searchMobUserDiv = $('.tableSearchMobUserDiv')
  const $mobUserSearchTemplateNotFound = $('.mobUserSearchTemplateNotFound')

  await fetch('http://localhost:3001/mobile-users/search?username='+ mobUser, {
    method: 'GET',
    mode: 'cors',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(user => {
    console.log(user);
    if(user.length !== 0){
      $searchMobUserDiv.show()
      $mobUserSearchTemplateNotFound.hide()        

      App.fillSearchMobUser(user);
    }else{
       $searchMobUserDiv.hide()
       $mobUserSearchTemplateNotFound.show()
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
},
fillSearchMobUser: async (user) => {
    
  const tableBody = document.querySelector('#tableMobUserSearch tbody');
  if(tableBody){
    // Clear existing table rows
    tableBody.innerHTML = '';
    // Iterate through each user and create a table row
    let i = 0;
    user.forEach(user => {
      i++;
      const row = document.createElement('tr');
      row.innerHTML = `
      <td></td>
      <td>${i}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>${user.username}</td>
      <td>${user.address}</td>
      <td>${user.email}</td>
      <td>${user.status === true ? 'Active' : 'Inactive'}</td>
      <td>${user.createdAt}</td>
      `;
      tableBody.appendChild(row);
    });
  }else {
    console.error('Element with id "tableBody" not found.');
  }

},
addProductCopyDB: async (productId, productName, productReference, manufacturer, madeIn, price, warranty, yearOfRelease, description, category, createdBy, uid_hash) =>{

    try {
      const addProductData = {
        productId: productId,
        productName: productName,
        productReference: productReference,
        manufacturer: manufacturer,
        madeIn: madeIn,
        price: price,
        warranty: warranty,
        yearOfRelease: yearOfRelease,
        description: description,
        category: category,
        createdBy: createdBy,
        uid_hash: uid_hash
      };
  
      const response = await fetch('http://localhost:3001/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addProductData),
        mode: 'cors',
      });

      if (response.status === 201) {
        //await Gateway.addCategoryMessageHandler('New category has been saved successfully')
        console.log('New product has been saved successfully')
      } else {
        //await Gateway.addCategoryMessageHandler('Error: '+ response.statusText +', Status ' + response.status)
        console.log('Error: '+ response.statusText +', Status: ' + response.status)
      }
      
    } catch (error) {
      // Handle any errors occuring during API invocation
      console.log('Error:'+ error.message)
      throw error;
    }

  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if(boolean){
        loader.show()
        content.hide()
    }else{
        loader.hide()
        content.show()
    }
  }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})