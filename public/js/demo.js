/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global $, TextSummary, _, hljs, TWITTER_USER */
'use strict';

var markdown = function(s) {
  return window.markdownit().render(s);
};

var OUTPUT_LANG = 'en';

var location_summary;
var weather_description;

var user_name;
var pronoun;
var pronoun_possessive;
var pronoun_object;

var personality_traits;
var user_needs;
var need1;
var last_sentence;
var description_sentence;
var action_sentence;
// Big 5 personality traits, ranked 1 to 5
var big5personality_1;
var big5personality_2;

// Big 5 personality traits children, ranked 1 to 5
// Trait #1
var big5personality_1_child_1;
var big5personality_1_child_2;

// var usersRef = ref.child("users");

var globalState = {
  twitterUserId: undefined,
  selectedTwitterUser: undefined,
  selectedTwitterImage: undefined,
  selectedTwitterUserLang: undefined,
  selectedSample: undefined,
  languageSelected: undefined,
  currentProfile: undefined,
  userLocale: undefined
};

var QUERY_PARAMS = (function(a) {
  if (a == '')
    return {};
  var b = {};
  for (var i = 0; i < a.length; ++i) {
    var p = a[i].split('=', 2);
    if (p.length == 1)
      b[p[0]] = '';
    else
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
  }
  return b;
})(window.location.search.substr(1).split('&'));

function getBrowserLang() {
  if (navigator.languages != undefined)
    return navigator.languages[0];
  else
    return navigator.language;
}

function getBrowserLangNoLocale() {
  var lang = getBrowserLang();
  return lang.substring(0, 2);
}

function getName() {
  user_name = document.getElementById('user_name').value;
  // console.log(user_name);
}

function getPronoun() {
  pronoun = document.getElementById('pronoun').value.toLowerCase();
  var pronounList = {
    'he': ['his', 'him'],
    'she': ['her', 'her'],
    'they': ['their', 'them']
  }
  pronoun_possessive = pronounList[pronoun][0];
  pronoun_object = pronounList[pronoun][1];
  // console.log(pronoun_possessive);
  // console.log(pronoun_object);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    displayLocation(lat,lon);
    getWeather(lat,lon);
}

function displayLocation(latitude,longitude){
  var request = new XMLHttpRequest();
  var method = 'GET';
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
  var async = true;

  request.open(method, url, async);
  request.onreadystatechange = function(){
    if(request.readyState == 4 && request.status == 200){
      var data = JSON.parse(request.responseText);
      var city = data.results[0].address_components[3].short_name;
      var state = data.results[0].address_components[5].short_name;
      var country = data.results[0].address_components[6].long_name;
      location_summary = city + ', ' + state;
      // console.log(location_summary);
      // document.getElementById('location-info').innerHTML = "Location: " + location_summary;
    }
  };
  request.send();
};

function getWeather(latitude,longitude){
  var request = new XMLHttpRequest();
  var method = 'GET';
  var url = 'https://api.apixu.com/v1/current.json?key=911eaf69e5274bddaa5194242170607&q=' + latitude + "," + longitude;
  var async = true;

  request.open(method, url, async);
  request.onreadystatechange = function(){
    if(request.readyState == 4 && request.status == 200){
      var data = JSON.parse(request.responseText);
      var weather_now = data.current.condition.text;
      weather_description = weather_now.toLowerCase();
      // console.log(weather_description);
      // document.getElementById('weather-info').innerHTML = "Weather: " + weather_description;
    }
  };
  request.send();
};

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  if (response.status === 'connected') {
    testAPI();
  } else if (response.status === 'not_authorized') {
    document.getElementById('inputText2').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    document.getElementById('inputText2').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}
// This function is called when someone finishes with the Login Button.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '837607693056127',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.5'
  });

  // Get login status (logged into FB, logged into FB app, etc)
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function testAPI() {
  getFBPosts();
}

function getFBPosts() {

  var posts;
  FB.api(
    '/me/posts?limit=1000',
    'GET',
    {"fields":"message"},
    function(response) {
      var post =" ";
      for(var k in response.data) {
        post = response.data[k].message;
        if(post === undefined || post === null){
          post = " ";
        }
        posts+="\n "+post;
      }
      document.getElementById('inputText2').value = posts.replace("undefined", "");
    }
  );
}

function extend(target, source) {
  Object.keys(source).forEach(function(k) {
    target[k] = source[k];
  });
  return target;
}

function clone(o) {
  return extend({}, o);
}

function replaces(s, replaces) {
  var out = s;
  replaces.forEach(function(r) {
    out = out.replace(r.search, r.replace);
  });

  return out;
}

function renderMarkdown(s) {
  return replaces(markdown(s || ''), [
    {
      search: /\<\a /g,
      replace: '<a class="base--a" target="_blank" '
    }
  ]);
}




$(document).ready(function() {

  getLocation();

  var textCache = {};

  // globalState.selectedSample = SAMPLE_TEXTS[0];
  globalState.languageSelected = undefined;

  var $big5Traits = $('.output-big-5--traits');
  var $needsTraits = $('.output-needs--traits');
  var $needsMoreTraits = $('.output-needs--more-traits');
  var $valuesTraits = $('.output-values--traits');
  var $needsToggle = $('.output-needs--toggle');
  var $outputSummaryText = $('.output-summary--summary');
  var $inputTextArea = $('.input--text-area');
  var $inputWordCount = $('.input--word-count-number');
  var $inputForm1 = $('.input--form1');
  var $inputForm2 = $('.input--form2');
  var $resetButton = $('.input--reset-button');
  var $loading = $('.loading');
  var $output = $('.output');
  var $outputHeader = $('.output--header');
  var $outputJSON = $('.output--json');
  var $outputJSONCode = $('.output--json-code');
  var $outputJSONButton = $('.output--json-button');
  var $error = $('.error');
  var $errorMessage = $('.error--message');

  // Instantiate external PI modules
  const TraitNames = new PersonalityTraitNames({
    version : 'v3',
    locale : globalState.userLocale || OUTPUT_LANG
  });

  const TraitDescriptions = new PersonalityTraitDescriptions({
    version: 'v3',
    locale: globalState.userLocale || OUTPUT_LANG,
    format: 'markdown'
  });

  const ConsumptionPreferences = new PersonalityConsumptionPreferences({
    version: 'v3',
    locale: globalState.userLocale || OUTPUT_LANG
  });

  function setTextSample(value, readonly) {
    $('#inputText').val(value);
    if (readonly) {
      $('#inputText').attr('readonly', 'readonly');
    } else {
      $('#inputText').removeAttr('readonly');
    }
  }

  function setLoadingState() {
    resetOutputs();
    $loading.show();
    scrollTo($loading);
  }

  function loadTwitterUser(twitterHandle, options) {
    setLoadingState();
    getProfileForTwitterUser(twitterHandle, options);
    getName();
    getPronoun();
  }

  function registerHandlers() {
    globalState.userLocale = getBrowserLangNoLocale();

    $('input[name="text-lang"]').click(function() {
      globalState.selectedLanguage = $(this).attr('value');
    });

    $(window).resize(function() {
      if ($(window).width() < 800) {
        $('.smartphone-hidden').hide();
        if (globalState.selectedSample == 'custom') {
          $('input[name="text-sample"]:first').trigger('click');
        }
      } else {
        $('label[for="text-custom"]').show();
      }
    });

    $('input#text-custom').unbind('click').click(function() {
      globalState.selectedSample = 'custom';

      $inputTextArea.removeClass('right-to-left');
      $inputTextArea.addClass('left-to-right');

      $('#languageChooser').show();
      setTextSample('', false);
      updateWordCount();

      if (!globalState.selectedLanguage) {
        $('input#lang-en').trigger('click');
      }
    });

    $('input[name="twitter"]').click(function() {
      var twitterId = $(this).val();
      var twitterLang = $(this).attr('data-lang');
      globalState.selectedTwitterUser = twitterId;
      globalState.selectedTwitterImage = $('label[for="' + $(this).attr('id') + '"] img').attr('src');
      globalState.selectedTwitterUserLang = twitterLang;
    });

    $inputForm1.submit(function(e) {
      e.cancelBubble = true;
      e.preventDefault();
      if (e.stopPropagation)
        e.stopPropagation();

      enableAnalyzeButtons(false);
      loadTwitterUser(globalState.selectedTwitterUser, {
        language: globalState.selectedTwitterUserLang
      });
    });

    $inputForm2.submit(function(e) {
      e.cancelBubble = true;
      e.preventDefault();
      if (e.stopPropagation)
        e.stopPropagation();

      enableAnalyzeButtons(false);
      var lang = globalState.selectedSample == 'custom'
        ? globalState.selectedLanguage
        : $('input#text-' + globalState.selectedSample).attr('data-lang');

      setLoadingState();
      getName();
      getPronoun();

      getProfileForText($('.input--text-area').val(), {language: lang});
    });
  }

  function setTextSummary(profile) {
    var textSummary = new TextSummary({ version: 'v3', locale: globalState.userLocale || OUTPUT_LANG});
    var summary = textSummary.getSummary(profile);
    $('#personalitySummary').empty();
    $('#personalitySummary').append('<p class="base--p">' + summary.split('\n').join('</p><p class="base--p">') + '</p>');
  }

  /**
   * Toggle Big 5 Subtraits
   */
  $(document).on('click', '.output-big-5--trait-label', function() {
    $(this).closest('.percent-bar-and-score').toggleClass('toggled');
  });

  $resetButton.click(function() {
    $('input[name="twitter"]:first').trigger('click');
    $('input[name="text-sample"]:first').trigger('click');
    $('.tab-panels--tab:first').trigger('click');
    $('#your-twitter-panel .auth-form').show();
    $('#your-twitter-panel .analysis-form').hide();
    resetOutputs();
    selectDefaultLanguage();
  });

  // toggleNeedsTraits
  $needsToggle.click(function() {
    $needsMoreTraits.toggle();
    $needsToggle.text($needsToggle.text() == '<<' ? '>>' : '<<');
  });

  $outputJSONButton.click(function() {
    $outputJSON.toggle();
    scrollTo($outputJSON);
  });

  function getProfileForTwitterUser(userId, options) {
    getProfile(userId, extend(options || {}, { source_type: 'twitter' }));
  }

  function getProfileForText(text, options) {
    getProfile(text, extend(options || {}, {source_type: 'text'}));
  }


  /**
  * Localization
  */
  function replacementsForLang(lang) {
    var replacements = {
      'en': {
        'Extraversion': 'Introversion/Extraversion',
        'Outgoing': 'Warmth',
        'Uncompromising': 'Straightforwardness',
        'Immoderation': 'Impulsiveness',
        'Susceptible to stress': 'Sensitivity to stress',
        'Conservation': 'Tradition',
        'Openness to change': 'Stimulation',
        'Hedonism': 'Taking pleasure in life',
        'Self-enhancement': 'Achievement',
        'Self-transcendence': 'Helping others'
      },
      'ja': {
        'Openness': '知的好奇心',
        'Friendliness': '友好性'
      }
    };

    return replacements[lang] || {};
  }

  function getErrorMessage(error) {
    var message = GENERIC_REQUEST_ERROR;
    if (error.responseJSON && error.responseJSON.error) {
      message = error.responseJSON.error.error;
    } else if (error.responseJSON && error.responseJSON.message) {
      message = error.responseJSON.message
    }
    return message;
  }

  function defaultProfileOptions(options) {
    var defaults = extend({
      source_type: 'text',
      accept_language: globalState.userLocale || OUTPUT_LANG,
      include_raw: true,
      consumption_preferences: true
    }, options || {});

    if (defaults.source_type !== 'twitter') {
      defaults = extend({
        language: globalState.userLocale || OUTPUT_LANG,
        raw_scores: true,
      }, defaults);
    }
    return defaults;
  }

  function enableAnalyzeButtons(value) {
    $('.input--submit-button1').prop('disabled', !value);
    $('.input--submit-button2').prop('disabled', !value);
  }

  function getProfile(data, options) {
    options = defaultProfileOptions(options);

    var payload = clone(options),
      url = '/api/profile/' + options.source_type;

    if (options.source_type === 'twitter')
      payload.userId = data;
    else
      payload.text = data;

    $.ajax({
      type: 'POST',
      data: payload,
      url: url,
      dataType: 'json',
      success: function(data) {
        $loading.hide();
        $output.show();
        scrollTo($outputHeader);
        loadOutput(data);
        updateJSON(data);
        loadConsumptionPreferences(data);
        enableAnalyzeButtons(true);
        console.log(data);
      },
      error: function(err) {
        // eslint-disable-next-line
        console.error(err);
        $loading.hide();
        $error.show();
        $errorMessage.text(getErrorMessage(err));
        enableAnalyzeButtons(true);
      }
    });
  }

  /**
  * cpIdMapping returns the description for a consumption_preference_id
  * Uses the personality-consumption-preferences npm module
  */
  function cpIdMapping(consumption_preference_id) {
    return ConsumptionPreferences.description(consumption_preference_id);
  }

  function cpIdSortingLikely(cpid, lang) {
     var sortArray;
     if(lang == 'en') sortArray = enSortLikely;
     if(lang == 'es') sortArray = esSortLikely;
     if(lang == 'ja') sortArray = jaSortLikely;
     if(lang == 'ar') sortArray = arSortLikely;
     return sortArray.indexOf(cpid);
  }

  function cpIdSortingUnlikely(cpid, lang) {
     var sortArray;
     if(lang == 'en') sortArray = enSortUnlikely;
     if(lang == 'es') sortArray = esSortUnlikely;
     if(lang == 'ja') sortArray = jaSortUnlikely;
     if(lang == 'ar') sortArray = arSortUnlikely;
     return sortArray.indexOf(cpid);
  }

  var consumptionPrefMusic = new Set([
    'consumption_preferences_music_rap',
    'consumption_preferences_music_country',
    'consumption_preferences_music_r_b',
    'consumption_preferences_music_hip_hop',
    'consumption_preferences_music_live_event',
    'consumption_preferences_music_playing',
    'consumption_preferences_music_latin',
    'consumption_preferences_music_rock',
    'consumption_preferences_music_classical'
  ]);

  var consumptionPrefMovie = new Set([
    'consumption_preferences_movie_romance',
    'consumption_preferences_movie_adventure',
    'consumption_preferences_movie_horror',
    'consumption_preferences_movie_musical',
    'consumption_preferences_movie_historical',
    'consumption_preferences_movie_science_fiction',
    'consumption_preferences_movie_war',
    'consumption_preferences_movie_drama',
    'consumption_preferences_movie_action',
    'consumption_preferences_movie_documentary'
  ]);

  function addIfAllowedReducer(accumulator, toadd) {
    if (consumptionPrefMusic.has(toadd.cpid)) {
      if (accumulator.reduce(function(k, v) {
        return consumptionPrefMusic.has(v.cpid)
          ? k + 1
          : k;
      }, 0) < 1) {
        accumulator.push(toadd);
      }
    } else if (consumptionPrefMovie.has(toadd.cpid)) {

      if (accumulator.reduce(function(k, v) {
        return consumptionPrefMovie.has(v.cpid)
          ? k + 1
          : k;
      }, 0) < 1) {
        accumulator.push(toadd);
      }
    } else {
      accumulator.push(toadd);
    }
    return accumulator;
  }

  function sortIdxComparator(x, y) {

    var a = x.idx;
    var b = y.idx;

    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }

    if (a === b) {
      return 0;
    }
  }

  function mapPersonalityTraits(big5personality_1) {
    var big5PersonalityTraits = {
      'openness': 'has a very open outlook',
      'conscientiousness': 'pays attention to details',
      'extraversion': 'enjoys going to parties and meeting new people',
      'agreeableness': 'is friendly and nice',
      'emotional range': 'has a broad emotional range',
    };
    return (big5PersonalityTraits[big5personality_1]);
  }

  function mapPersonalityToPrompt(big5personality_1) {
    var big5PersonalityPrompts = {
      'openness': 'Imagine you’re their close friend. Tell them something that will inspire them to try something new today.',
      'conscientiousness': 'Imagine you’re their personal assistant and you admire everything they do. Give them a list of what to do today.',
      'extraversion': 'Appeal to their social butterfly tendencies by telling them about a time you woke up early to see your friends.',
      'agreeableness': 'Think about positive messages you have heard in the past and repeat one to them.',
      'emotional range': 'They respond to softly spoken words. Imagine you are their mother waking them up.',
    };
    return (big5PersonalityPrompts[big5personality_1]);
  }

  function loadConsumptionPreferences(data) {
    var cpsect = $('.output-summary--consumption-behaviors--section');
    var behaviors = $('.output-summary--consumption-behaviors--section');
    var behaviors_likely = $('.output-summary--likely-behaviors');
    var behaviors_unlikely = $('.output-summary--unlikely-behaviors');
    var lang = data.processed_language;

    if (data.consumption_preferences) {
      var likelycps = data.consumption_preferences.reduce(function(k, v) {
        v.consumption_preferences.map(function(child_item) {
          if (child_item.score === 1) {
            k.push({
              name: cpIdMapping(child_item.consumption_preference_id),
              idx: cpIdSortingLikely(child_item.consumption_preference_id,lang),
              cpid: child_item.consumption_preference_id
            });
          }
        });
        return k;
      }, []);

      var unlikelycps = data.consumption_preferences.reduce(function(k, v) {
        v.consumption_preferences.map(function(child_item) {
          if (child_item.score === 0) {
            k.push({
              name: cpIdMapping(child_item.consumption_preference_id),
              idx: cpIdSortingUnlikely(child_item.consumption_preference_id,lang),
              cpid: child_item.consumption_preference_id
            });
          }
        });
        return k;
      },[]);

      behaviors_likely.empty();
      likelycps.sort(sortIdxComparator).reduce(addIfAllowedReducer, []).slice(0, 3).map(function(item) {
        behaviors_likely.append("<div class=\"output-summary--behavior output-summary--behavior_POSITIVE\"><i class=\"icon icon-likely\"></i>" + item.name + "</div>\n");
      });

      behaviors_unlikely.empty();
      unlikelycps.sort(sortIdxComparator).reduce(addIfAllowedReducer, []).slice(0, 3).map(function(item) {
        behaviors_unlikely.append('<div class="output-summary--behavior output-summary--behavior_NEGATIVE"><i class="icon icon-not-likely"></i>' + item.name + '</div>\n');
      });

      behaviors_likely.show();
      behaviors_unlikely.show();
    } else {
      behaviors_likely.hide();
      behaviors_unlikely.hide();
    }
  }


  const replacements = replacementsForLang(globalState.userLocale || OUTPUT_LANG);

  function loadOutput(data) {

    setTextSummary(data);
    loadWordCount(data);

    // Rank the needs according to strength
    user_needs = wrapNeeds(data).sort(sortScores);
    need1 = user_needs[0].name.toLowerCase();

    // Rank the Big Five Personality traits according to strength
    personality_traits = wrapTraits(data).sort(sortScores);

    // Big 5 personality traits, strongest
    big5personality_1 = personality_traits[0].name.toLowerCase();
    // big5personality_2 = personality_traits[1].name.toLowerCase();

    // Big 5 personality traits children, strongest
    // Trait #1
    big5personality_1_child_1 = personality_traits[0].children[0].name.toLowerCase();
    big5personality_1_child_2 = personality_traits[0].children[1].name.toLowerCase();

    description_sentence = mapPersonalityTraits(big5personality_1);
    action_sentence = mapPersonalityToPrompt(big5personality_1);
    // console.log(last_sentence);

    //Add wrapped traits data from the user profile into the html
    $big5Traits.append(_.template(big5PercentTemplate.innerHTML, {
      items: wrapTraits(data).sort(sortScores),
      tooltips: function(traitId) {
        return renderMarkdown(TraitDescriptions.description(traitId));
      }
    }));

    // Add wrapped needs data from the specified user profile into the html
    $needsTraits.append(_.template(outputStatsPercentTemplate.innerHTML, {
      items: wrapNeeds(data).sort(sortScores).slice(0, 5),
      tooltips: function(traitId) {
        return renderMarkdown(TraitDescriptions.description(traitId));
      }
    }));

    // Add wrapped needs 'more' data from the specified user profile into the html
    $needsMoreTraits.append(_.template(outputStatsPercentTemplate.innerHTML, {
      items: wrapNeeds(data).sort(sortScores).slice(5, wrapNeeds(data).length),
      tooltips: function(traitId) {
        return renderMarkdown(TraitDescriptions.description(traitId));
      }
    }));

    // Add wrapped values data from the specified user profile into the html
    $valuesTraits.append(_.template(outputStatsPercentTemplate.innerHTML, {
      items: wrapValues(data).sort(sortScores),
      tooltips: function(traitId) {
        return renderMarkdown(TraitDescriptions.description(traitId));
      }
    }));

    globalState.currentProfile = data;

  }


  function wrapTraits(data){
    return data.personality.map(function(obj) {
      const traitName = TraitNames.name(obj.trait_id);
      return {
        name: replacements[traitName] ? replacements[traitName] : traitName,
        id: obj.trait_id,
        score: Math.round(obj.percentile * 100),
        raw_score: obj.raw_score,
        children: obj.children.map(function(obj2) {
          const traitName2 = TraitNames.name(obj2.trait_id);
          return {
            name: replacements[traitName2] ? replacements[traitName2] : traitName2,
            id: obj2.trait_id,
            score: Math.round(obj2.percentile * 100),
            raw_score: obj2.raw_score
          }
        }).sort(function(a, b) { return b.score - a.score; })
      }
    });
  }

  function wrapNeeds(data) {
    return data.needs.map(function(obj) {
      const traitName = TraitNames.name(obj.trait_id);
      return {
        id: obj.trait_id,
        name: replacements[traitName] ? replacements[traitName] : traitName,
        score: Math.round(obj.percentile * 100),
        raw_score: obj.raw_score
      }
    });
  }

  function wrapValues(data) {
    return data.values.map(function(obj) {
      const traitName = TraitNames.name(obj.trait_id);
      return {
        id: obj.trait_id,
        name: replacements[traitName] ? replacements[traitName] : traitName,
        score: Math.round(obj.percentile * 100),
        raw_score: obj.raw_score
      };
    });
  }


  $inputTextArea.on('propertychange change click keyup input paste', function() {
    updateWordCount();
  });

  function loadWordCount(data) {
    $('.output--word-count-number').text(data.word_count);
    $('.output--word-count-message').removeClass('show');
    if (data.processed_lang === 'en') {
      if (data.word_count >= 3000)
        $('.output--word-count-message_VERY-STRONG_NEW_MODEL').addClass('show');
      else if (data.word_count < 3000 && data.word_count >= 1200)
        $('.output--word-count-message_STRONG_NEW_MODEL').addClass('show');
      else if (data.word_count < 1200 && data.word_count >= 600)
        $('.output--word-count-message_DECENT_NEW_MODEL').addClass('show');
      else
        $('.output--word-count-message_WEAK_NEW_MODEL').addClass('show');
    }
    else {
      if (data.word_count > 6000)
        $('.output--word-count-message_VERY-STRONG').addClass('show');
      else if (data.word_count <= 6000 && data.word_count >= 3500)
        $('.output--word-count-message_STRONG').addClass('show');
      else if (data.word_count < 3500 && data.word_count >= 1500)
        $('.output--word-count-message_DECENT').addClass('show');
      else
        $('.output--word-count-message_WEAK').addClass('show');
    }
  }

  function scrollTo(element) {
    $('html, body').animate({
      scrollTop: element.offset().top
    }, 'fast');
  }

  function resetOutputs() {
    $output.hide();
    $error.hide();
    $loading.hide();
    $big5Traits.empty();
    $needsTraits.empty();
    $needsMoreTraits.empty();
    $valuesTraits.empty();
    $('.output-big-5--sub-tree').hide();
    $needsMoreTraits.hide();
    $outputSummaryText.empty();
    $outputJSONCode.empty();
    $outputJSON.hide();
  }


  function sortScores(obj1, obj2) {
    return obj2.score - obj1.score;
  }

  function preloadSampleTexts(callback) {
    var shared = {
      done: 0
    };
    SAMPLE_TEXTS.forEach(function(name) {
      $Q.get('data/text/' + name + '.txt').then(function(text) {
        shared.done = shared.done + 1;
        textCache[name] = text;

        if (shared.done == SAMPLE_TEXTS.length && callback) {
          callback();
        }
      }).done();
    });
  }

  function loadSampleText(name) {
    if (textCache[name]) {
      setTextSample(textCache[name], true);
      updateWordCount();
    } else {
      $Q.get('data/text/' + name + '.txt').then(function(text) {
        setTextSample(text, true);
        textCache[name] = text;
      }).then(function() {
        updateWordCount();
      }).done();
    }
  }

  function selfAnalysis() {
    return QUERY_PARAMS.source == 'myself';
  }

  function setSelfAnalysis() {
    // console.log('Analyzing twitter user ', '@' + TWITTER_USER);
    globalState.twitterUserId = TWITTER_USER.handle;
    globalState.twitterUserImage = TWITTER_USER.image;
    loadTwitterUser(TWITTER_USER.handle, {live_crawling: true});
    $('#self-analysis-tab').trigger('click');
    $('#your-twitter-panel .auth-form').hide();
    $('#your-twitter-panel .analysis-form label').remove();
    $('#your-twitter-panel .analysis-form').append([
      '<label class="base--inline-label input--radio" for="my-twitter">', '<img class="input--thumb" src="', TWITTER_USER.image || '/images/no-image.png',
      '">@',
      TWITTER_USER.handle,
      '</label>'
    ].join(''));
    $('#my-twitter').trigger('click');
    $('#your-twitter-panel .analysis-form').show();
  }

  function initialize() {
    $('input[name="twitter"]:first').attr('checked', true);
    $('input[name="text-sample"]:first').attr('checked', true);

    globalState.selectedTwitterUser = $('input[name="twitter"]:first').val();
    registerHandlers();
    $inputTextArea.addClass('orientation', 'left-to-right');

    if (selfAnalysis() && TWITTER_USER.handle) {
      setSelfAnalysis();
    }
    selectDefaultLanguage();
  }

  function selectDefaultLanguage() {
    if (['en', 'es', 'ja', 'ar'].indexOf(globalState.userLocale) >= 0) {
      $('#lang-' + globalState.userLocale).prop('checked', true).trigger('click');
    }
  }

  function countWords(str) {
    return str.split(' ').length;
  }

  function updateWordCount() {
    $inputWordCount.text(countWords($inputTextArea.val()));
  }

  // Get the JSON file
  function updateJSON(results) {
    buildPrompt();

    $outputJSONCode.html(JSON.stringify(results, null, 2));
    $('.code--json').each(function(i, b) {
      hljs.highlightBlock(b);
    });

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBZmbEkVlaXlB75a4QEoASJnHHFAP4Xabg",
      authDomain: "stir-f9d29.firebaseapp.com",
      databaseURL: "https://stir-f9d29.firebaseio.com",
      projectId: "stir-f9d29",
      storageBucket: "stir-f9d29.appspot.com",
      messagingSenderId: "898960908506"
    };
    firebase.initializeApp(config);
    // console.log("initialized");

    // Save the JSON file to Firebase
    var json_str = JSON.stringify(results, null, 2);

    // Create new filename
    var date = new Date();
    var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];
    var newId = components.join("");
    var fileName = newId + '.json';

    var storageRef = firebase.storage().ref()
    var testRef = storageRef.child(fileName);

    // Save the JSON file locally
    uploadFile(fileName, "data:application/json", new Blob([json_str],{type:""}));

    function uploadFile (name, type, data) {
        // if (data != null && navigator.msSaveBlob)
        //   return navigator.msSaveBlob(new Blob([data], { type: type }), name);
        testRef.put(new Blob([json_str],{type:""})).then(function(snapshot) {
          console.log('Uploaded JSON');
        });
    }

    // Tracery grammar

    function buildPrompt() {

        var syntax = {
          "sentences": [
            "#intro_sentence# #location_sentence# #personality_sentence# #prompt_sentence#"
          ],
          "intro_sentence": [
            "Today you’ll be waking: #name#."
          ],
          "location_sentence": [
            "#name# lives in #location#, where it's #weather#.",
            "Right now it's #weather# in #name#'s neck of the woods, #location#.",
            "In #location#, where #name# lives, it's currently #weather#.",
            "The weather in #pronoun_possessive# city, #location#, is currently #weather#."
          ],
          "personality_sentence": [
            "#name# #description_sentence#, with a strong leaning toward #personality1_child1# and #personality1_child2#.",
            "As someone who #description_sentence#, #name# has a talent for #personality1_child1# and #personality1_child2#.",
            "#name# #description_sentence#, with a strong leaning towards #personality1_child1# and #personality1_child2#."
          ],
          "name": user_name,
          "pronoun": pronoun,
          "pronoun_possessive": pronoun_possessive,
          "pronoun_object": pronoun_object,
          "location": location_summary,
          "weather": weather_description,
          "personality1": big5personality_1,
          "personality1_child1": big5personality_1_child_1,
          "personality1_child2": big5personality_1_child_2,
          "description_sentence": description_sentence,
          "prompt_sentence": action_sentence
        };

        var grammar = tracery.createGrammar(syntax);
        // grammar.addModifiers(tracery.baseEngModifiers);
        var prompt = grammar.flatten('#sentences#')
        console.log(prompt);
        document.getElementById('generated-prompt').innerHTML = prompt;
        return prompt;
      }
  }

  initialize();
});
