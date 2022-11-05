/* eslint-disable */
// import '@babel/polyfill';
// import { login, logout } from './login';
// import { updateSettings } from './updateSettings';
// import { bookTour } from './stripe';
//import { displayMap } from './mapbox';



// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const registerForm = document.querySelector('.form--register');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const ForgotPassword = document.querySelector('.ma-st-md');



 const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
 const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};



// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
 // displayMap(locations);
mapboxgl.accessToken =
 'pk.eyJ1Ijoic3VicmF0MDA3IiwiYSI6ImNrYjNyMjJxYjBibnIyem55d2NhcTdzM2IifQ.-NnMzrAAlykYciP4RP9zYQ';

var map = new mapboxgl.Map({
 container: 'map',
 style: 'mapbox://styles/mapbox/streets-v11',
 scrollZoom: false
 // center: [-118.113491, 34.111745],
 // zoom: 10,
 // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
 // Create marker
 const el = document.createElement('div');
 el.className = 'marker';

 // Add marker
 new mapboxgl.Marker({
   element: el,
   anchor: 'bottom'
 })
   .setLngLat(loc.coordinates)
   .addTo(map);

 // Add popup
 new mapboxgl.Popup({
   offset: 30
 })
   .setLngLat(loc.coordinates)
   .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
   .addTo(map);

 // Extend map bounds to include current location
 bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
 padding: {
   top: 200,
   bottom: 150,
   left: 100,
   right: 100
 }
});

}

const sendEmail = async (email,) => {
  console.log(email,'email_check')
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://127.0.0.1:3000/api/v1/users/forgotPassword',
      withCredentials:true,
   
      data: {
        email,
      }
     
    });
console.log(res);
    if (res.data.status === 'success') {
    
      
      showAlert('success', 'Link sent successfully.Please check you email!');
  
     
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const resetPassword = async (password,passwordConfirm,token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `https://127.0.0.1:3000/api/v1/users/resetPassword/${token}`,
      withCredentials:true,
   
      data: {
        password,
        passwordConfirm
      }
     
    });
console.log(res);
    if (res.data.status === 'success') {
    
      
      showAlert('success', 'New password updated sucessfully');
  
      window.setTimeout(async () => {
        location.assign('/')
           }, 1500);
     
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};



const register = async (name,email, password,passwordConfirm) => {
  console.log(email,password,'front req body')
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://127.0.0.1:3000/api/v1/users/signup',
      withCredentials:true,
   
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
     
    });
console.log(res);
    if (res.data.status === 'success') {
    
      
      showAlert('success', 'Registered successfully!');
  
      window.setTimeout(async () => {
   location.assign('/')
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};



const login = async (email, password) => {
  console.log(email,password,'front req body')
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://127.0.0.1:3000/api/v1/users/login',
      withCredentials:true,
   
      data: {
        email,
        password
      }
     
    });
console.log(res);
    if (res.data.status === 'success') {
    
      
      showAlert('success', 'Logged in successfully!');
  
      window.setTimeout(async () => {
   location.assign('/')
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};






if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if(registerForm){
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name=document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm=document.getElementById('passwordConfirm').value;
    register(name,email, password,passwordConfirm);
  });
}
if(ForgotPassword){
  ForgotPassword.addEventListener('click', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    sendEmail(email)
  })
}
 

if(forgotPasswordForm){
  forgotPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm=document.getElementById('passwordConfirm').value;
    console.log(document.URL,'urllllllllllll')
    const token=document.URL.split('/')
    resetPassword(password,passwordConfirm,token[token.length-1])
  })
}







  const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: 'https://127.0.0.1:3000/api/v1/users/logout'
      });
      if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
      console.log(err.response);
      showAlert('error', 'Error logging out! Try again.');
    }
  };
  

if (logOutBtn) logOutBtn.addEventListener('click', logout);













const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'https://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'https://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};








if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });












 const stripe = Stripe('pk_test_51L7yNJSFV7XQfAoNvwY0W7jTLhx485EpCZ39zyhI9g71U4nn7i2QV6hnGGuZ2rq2wbVE0k3vo8N5tMCRx8jnZ4D9006dT6LeXc');


  const bookTour = async tourId => {
    try {
      // 1) Get checkout session from API
      const session = await axios(
        `https://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
      );
      console.log(session);
  
      // 2) Create checkout form + chanre credit card
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id
      });
    } catch (err) {
      console.log(err);
      showAlert('error', err);
    }
  };
  

  
if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
