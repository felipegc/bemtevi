var SUCCESS_MESSAGE = 'Entraremos em contato o mais breve possível';
var ERROR_MESSAGE = 'Ops. Alguma coisa deu errado. Tente novamene mais tarde';
var SEND_MAIL_ENDPOINT = 'https://us-central1-fb-bemtevisaude.cloudfunctions.net/sendEmail';

$(function () {
  // MENU
  $('.navbar-collapse a').on('click',function(){
    $('.navbar-collapse').collapse('hide');
  });

  //ABOUT
  $('#btn-more').on('click',function(){
    $('#description').css('display', 'inline');
  });

  // AOS ANIMATION
  AOS.init({
    disable: 'mobile',
    duration: 800,
    anchorPlacement: 'center-bottom'
  });

  // SMOOTHSCROLL NAVBAR
  $(function() {
    $('.navbar a, .hero-text a').on('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - 49
      }, 1000);
      event.preventDefault();
    });
  });

  // FORM INPUTS
  $('#inputName').on('focus', function () {
    removeIsInvalidClassFromElement('inputName');
  });

  $('#inputEmail').on('focus', function () {
    removeIsInvalidClassFromElement('inputEmail');
  });

  var maskBehavior = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
  },

  options = {
    onKeyPress: function(val, e, field, options) {
      field.mask(maskBehavior.apply({}, arguments), options);
    }
  };

  $('#inputPhone').mask(maskBehavior, options);

  $('#inputPhone').on('focus', function () {
    removeIsInvalidClassFromElement('inputPhone');
  });

  $('#inputMsg').on('focus', function () {
    removeIsInvalidClassFromElement('inputMsg');
  });

  // SEND EMAIL
  $('button#sendEmail').on('click', function() {
    var inputName = getElementById('inputName');
    var inputEmail = getElementById('inputEmail');
    var inputPhone = getElementById('inputPhone');
    var inputMsg = getElementById('inputMsg');

    if (!inputName.val()) {
      showAlert('Erro', 'Preencha o campo Nome.', 'danger');
      return;
    }

    if (!inputMsg.val()) {
      showAlert('Erro', 'Preencha o campo Mensagem.', 'danger');
      return;
    }

    var email = inputEmail.val();
    var phone = inputPhone.val();

    if (!email && !phone) {
      showAlert('Erro', 'Preencha Email ou Telefone.', 'danger');
      return;
    }

    var emailRegex = new RegExp(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g);
    if (!phone && !emailRegex.test(email)) {
      inputEmail.addClass('is-invalid');
      showAlert('Erro', 'Email inválido.', 'danger');
      return;
    }

    var phoneRegex = new RegExp(/\(\d{2}\)\s\d{4,5}\-\d{4}/g);
    if (!email && !phoneRegex.test(phone)) {
      inputPhone.addClass('is-invalid');
      showAlert('Erro', 'Telefone inválido.', 'danger');
      return;
    }

    blockEmailForm(inputName, inputEmail, inputPhone, inputMsg);

    var contact = {
      name: inputName.val(),
      phone: inputPhone.val(),
      email: inputEmail.val(),
      message: inputMsg.val(),
    }

    post(SEND_MAIL_ENDPOINT, contact).then(function (data) {
      console.log(data);
      showAlert('Sucesso', SUCCESS_MESSAGE, 'success');
    }).catch(function (data) {
      console.log(data);
      showAlert('Erro', ERROR_MESSAGE, 'danger');
    }).finally(function() {
      unblockEmailForm(inputName, inputEmail, inputPhone, inputMsg);
    });
  });

  function setLoadingAnimation() {
    var sendEmailButton = getElementById('sendEmail');
    disableElement(sendEmailButton);
    var spinningButton = getElementById('loading-email-button');
    addClass(spinningButton, 'spinner-border spinner-border-sm');
  }

  function removeDisableAttr(element) {
    removeAttributeFromElement(element, 'disabled');
  }

  function blockEmailForm(...elements) {
    setLoadingAnimation();
    elements.forEach(function(el) {
      disableElement(el);
    });
  }

  function unblockEmailForm(...elements) {
    var spinningButton = getElementById('loading-email-button');
    removeAttributeFromElement(spinningButton, 'class');
    var sendEmailButton = getElementById('sendEmail');
    removeDisableAttr(sendEmailButton);
    removeFocusFromElement(sendEmailButton);

    elements.forEach(function(el) {
      cleanInput(el)
      removeDisableAttr(el);
    });
  }

  function showAlert(title, body, type) {
    var alertMsg = getElementById('email-alert');
    addContentToInnerElement(alertMsg, 'strong', title);
    addContentToInnerElement(alertMsg, 'p', body);
    removeAttributeFromElement(alertMsg, 'class');
    addClass(alertMsg, `alert alert-${type}`);
    showElement(alertMsg);
    setTimeout(function() {
      hideElement(alertMsg);
    }, 5000)
  }

  function removeIsInvalidClassFromElement(elementId) {
    var element = getElementById(elementId);
    element.removeClass('is-invalid');
  }

  // JQUERY ABSTRACTION

  function post(endpoint, jsonData) {
    return new Promise(function (resolve, reject) {
      $.getJSON(endpoint, jsonData)
      .done(function(data) {
        resolve(data)
      })
      .fail(function(jqxhr) {
        reject(jqxhr.responseJSON);
      });
    });
  }

  function disableElement(element) {
    console.log('disableElementById');
    $(element).attr('disabled', true);
  }

  function getElementById(elementId) {
    return $(`#${elementId}`);
  }

  function addClass(element, cssClass) {
    $(element).addClass(cssClass);
  }

  function removeAttributeFromElement(element, attr) {
    $(element).removeAttr(attr);
  }

  function removeFocusFromElement(element) {
    $(element).blur();
  }

  function addContentToInnerElement(element, tag, content) {
    $(element).find(tag).html(content);
  }

  function showElement(element) {
    $(element).show();
  }

  function hideElement(element) {
    $(element).css('display', 'none');
  }

  function cleanInput(element) {
    $(element).val('');
  }
});