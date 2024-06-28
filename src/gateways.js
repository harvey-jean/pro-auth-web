Gateway = {

  base_url: 'http://localhost:3001',
  load: async () => {
    //Load app...
    await Gateway.getCategories()
    await Gateway.getWebUsers()
    await Gateway.getMobUsers()
    await Gateway.countRequestsPerHour()
    await Gateway.countVisits()
    await Gateway.countUniqueVisits()
  },
  login: async () =>{

    const username = $('#usernameIn').val()
    const password = $('#passwordIn').val()

    try {
      const loginData = {
        username: username,
        password: password,
      };
  
      const response = await fetch(Gateway.base_url + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        mode: 'cors',
      });

      if (response.status === 200) {
        window.sessionStorage.setItem('user', username)
        window.sessionStorage.setItem('isAuthValid', true)
        //$('usernameLoggedIn').html(window.sessionStorage.getItem('user'))
        window.location = 'home.html'
      } else if (response.status === 401) {
        await Gateway.loginFailedHandler('Unauthorized: Invalid credentials')
      } else if (response.status === 500) {
        await Gateway.loginFailedHandler('Server Error: Something went wrong on the server')
      } else {
        await Gateway.loginFailedHandler('Unexpected Error: Status ' + response.status)
      }
      
    } catch (error) {
      // Handle any errors, such as authentication failure or network issues.
      throw error;
    }

  },
  addCategory: async () =>{

    const categoryname = $('#catName').val()
    const categoryreference = $('#catReference').val()
    const description = $('#catDescription').val()
    const createdBy = $('#catCreatedBy').val()

    try {
      const addCategoryData = {
        categoryname: categoryname,
        categoryreference: categoryreference,
        description: description,
        createdBy: createdBy
      };
  
      const response = await fetch(Gateway.base_url + '/add-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addCategoryData),
        mode: 'cors',
      });

      if (response.status === 201) {
        await Gateway.addCategoryMessageHandler('New category has been saved successfully')
      } else {
        await Gateway.addCategoryMessageHandler('Error: '+ response.statusText +', Status ' + response.status)
      }
      
    } catch (error) {
      // Handle any errors occuring during API invocation
      throw error;
    }

  },
  getCategories: async () =>{
  
      await fetch(Gateway.base_url + '/categories', {
        method: 'GET',
        mode: 'cors',
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(categories => {
        // Call a function to fill the table with user data
        console.log(categories);
        $('#categoriesCounter').html(' '+ categories.length);
        Gateway.fillCategoryTable(categories);
        Gateway.fillProductSelectCategoryOption(categories);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      
  },
  fillCategoryTable: async (categories) =>{
    const tableBody = document.querySelector('#tableCategory tbody');

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
  fillProductSelectCategoryOption: async (categories) =>{
    const selectElement = document.querySelector('#prodCategory');
    if(selectElement){
      
      let i = 0;
      categories.forEach(category => {
        i++;
        //Fill Selection option with categories
        const option = document.createElement('option');
        option.value = category.categoryname; // Set the value attribute
        option.textContent = category.categoryname; // Set the text content
        selectElement.appendChild(option);
      });
    }else {
      console.error('Element with id "tableBody" not found.');
    }
  },
  addWebUser: async () =>{

    const firstname = $('#firstWName').val()
    const lastname = $('#lastWName').val()
    const username = $('#wUsername').val()
    const password = $('#wPassword').val()
    const address = $('#wUserAddress').val()
    const email = $('#wUserEmail').val()
    const role = $('#wUserRole').val()
    const createdBy = $('#wUserCreatedBy').val()

    try {
      const addWebUserData = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        address: address,
        email: email,
        role: role,
        createdBy: createdBy
      };
  
      const response = await fetch(Gateway.base_url + '/register-web-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addWebUserData),
        mode: 'cors',
      });

      const statusCode = response.status;
      const contentType = response.headers.get('Content-Type');
      if (statusCode === 200 || statusCode === 201) {
        await Gateway.addWebUserMessageHandler('User created successfully')
      } else {
        await Gateway.addWebUserMessageHandler('Error: '+ responseFormatHandler(response, contentType) 
        +', Status: ' + statusCode)
      }
      
    } catch (error) {
      // Handle any errors occuring during API invocation
      await Gateway.addWebUserMessageHandler('Error: '+ error.message)
    }

  },
  getWebUsers: async () =>{
  
    await fetch(Gateway.base_url + '/web-users', {
      method: 'GET',
      mode: 'cors',
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(users => {
      // Call a function to fill the table with user data
      console.log(users);
      Gateway.fillWebUsersTable(users);
      $('#webUsersCounter').html(' '+ users.length);
    })
    .catch(error => {
      console.error('Error:', error);
    }); 
},
fillWebUsersTable: async (users) =>{
  const tableBody = document.querySelector('#tableWebUsers tbody');

  // Clear existing table rows
  tableBody.innerHTML = '';

  // Iterate through each user and create a table row
  let i = 0;
  users.forEach(user => {
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
},
getMobUsers: async () =>{
  
  await fetch(Gateway.base_url + '/mobile-users', {
    method: 'GET',
    mode: 'cors',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(users => {
    // Call a function to fill the table with user data
    console.log(users);
    Gateway.fillMobUsersTable(users);
    $('#mobUsersCounter').html(' '+ users.length);
  })
  .catch(error => {
    console.error('Error:', error);
  }); 
},
fillMobUsersTable: async (users) =>{
  const tableBody = document.querySelector('#tableMobUsers tbody');

  // Clear existing table rows
  tableBody.innerHTML = '';

  // Iterate through each user and create a table row
  let i = 0;
  users.forEach(user => {
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
},
countRequestsPerHour: async () =>{
  
  await fetch(Gateway.base_url + '/request-last-hour', {
    method: 'GET',
    mode: 'cors',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(count => {
    // Call a function to fill the table with user data
    console.log(count.countFromLastHour);
    $('#mobRequestsPerHourCounter').html(' '+ count.countFromLastHour);
  })
  .catch(error => {
    console.error('Error:', error);
  }); 
},
countVisits: async () =>{
  
  await fetch(Gateway.base_url + '/total-all-visit', {
    method: 'GET',
    mode: 'cors',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(count => {
    // Call a function to fill the table with user data
    console.log(count.totalAllVisit);
    $('#mobCountVisit').html(' '+ count.totalAllVisit);
  })
  .catch(error => {
    console.error('Error:', error);
  }); 
},
countUniqueVisits: async () =>{
  
  await fetch(Gateway.base_url + '/total-unique-visit', {
    method: 'GET',
    mode: 'cors',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(count => {
    // Call a function to fill the table with user data
    console.log(count.totalUniqueVisit);
    $('#mobCountUniqueVisit').html(' '+ count.totalUniqueVisit);
  })
  .catch(error => {
    console.error('Error:', error);
  }); 
},
loginFailedHandler: async (errorMessage) =>{
    console.error(errorMessage);
    const errorDiv = $('#loginError');
    errorDiv.find('.errorMessage').html(errorMessage);
    errorDiv.show();
  },
  addCategoryMessageHandler: async (responseMessage) =>{
    console.error(responseMessage);
    const errorDiv = $('#addCategoryMessageDiv');
    errorDiv.find('.addCategoryMessage').html(responseMessage);
    errorDiv.show();

    $('#catName').val("")
    $('#catReference').val("")
    $('#catDescription').val("")
  },
  addWebUserMessageHandler: async (responseMessage) =>{
    console.error(responseMessage);
    const errorDiv = $('#addWebUserMessageDiv');
    errorDiv.find('.addWebUserMessage').html(responseMessage);
    errorDiv.show();

    $('#firstWName').val("")
    $('#lastWName').val("")
    $('#wUsername').val("")
    $('#wPassword').val("")
    $('#wUserAddress').val("")
    $('#wUserEmail').val("")
    //$('#wUserRole').val("")
  },
  responseFormatHandler: async (response, contentType) =>{
    if (contentType && contentType.includes('application/json')) {
      // Parse the response body as JSON if the content type is JSON
      const data = await response.json();
      return data;
    } else {
      // Parse the response body as text for other content types
      const data = await response.text();
      return data;
    }
  },
  logout: async () =>{
    window.sessionStorage.removeItem('user')
    window.sessionStorage.removeItem('isAuthValid')
    window.location = 'index.html'
  }

}

$(() => {
  $(window).load(() => {
      Gateway.load()
  })
})