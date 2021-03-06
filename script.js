(function () {

  var v = "1.11.1", // the minimum version of jQuery we want
    numRefs = 0,
    refsLoaded = 0;

  var loadRef = function (url, callback) {
    numRefs++;
    var done = false;
    var ref;
    if (url.indexOf('.css') > 0) {
      ref = document.createElement('link');
      ref.rel = 'stylesheet';
      ref.type = 'text/css';
      ref.href = url;
    } else {
      ref = document.createElement('script');
      ref.src = url;
    }
    ref.onload = ref.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        if (typeof callback !== 'undefined') {
          callback();
        }
        refsLoaded++;
        done = true;
      }
    };
    document.getElementsByTagName("head")[0].appendChild(ref);
  };


  var afterJQuery = function () {
    loadRef('//cdn2.hubspot.net/hubfs/1951809/debugger/hjDebugger.css?r=' + Date.now());
    loadRef('https://code.jquery.com/ui/1.10.1/themes/smoothness/jquery-ui.css');
    loadRef('https://code.jquery.com/ui/1.10.1/jquery-ui.min.js');
    loadRef('https://cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.min.js');
    var refsChecker = setInterval(function () {
      if (refsLoaded >= numRefs) {
        clearInterval(refsChecker);
        initDebugger();
      }
    }, 500);
  };

  if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    loadRef('//ajax.googleapis.com/ajax/libs/jquery/' + v + '/jquery.min.js', afterJQuery);
  } else {
    afterJQuery();
  }

  function initDebugger() {
    (window.myBookmarklet = function () {
      _hjSettings.hjdebug = true;
      jQuery('body').append(
        '<div id="_hjDebuggerMain">' +
        '   <div id="_hjDebuggerWindowTitle">HJ Debugger</div>' +
        '   <ul>' +
        '       <li class="open" id="_hjDebuggerSectionGeneral"><span>' + getGeneralInfo() + '</span></li>' +
        '       <li class="_hjDebuggerSection open' + (hjSiteSettings.heatmaps.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionHeatmaps"><span>' + hjSiteSettings.heatmaps.length + '</span></li>' +
        '       <li class="_hjDebuggerSection' + (hjSiteSettings.record == true ? ' on' : '') + '" id="_hjDebuggerSectionRecording"></li>' +
        '       <li class="_hjDebuggerSection' + (hjSiteSettings.forms.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionForms"><span>' + hjSiteSettings.forms.length + '</span></li>' +
        '       <li class="_hjDebuggerSection' + (hjSiteSettings.polls.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionPolls"><span>' + hjSiteSettings.polls.length + '</span></li>' +
        '       <li class="_hjDebuggerSection' + (hjSiteSettings.surveys.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionSurveys"><span>' + hjSiteSettings.surveys.length + '</span></li>' +
        '       <li class="_hjDebuggerSection' + (hjSiteSettings.testers_widgets.length > 0 ? ' on' : '') + '" id="_hjDebuggerSectionRecruiters"><span>' + hjSiteSettings.testers_widgets.length + '</span></li>' +
        '   </ul><div class="_hjDebuggerTab open" id="_hjDebuggerTabHeatmaps">' + getHeatmapInfo() + '</div>' +
        '   <div class="_hjDebuggerTab" id="_hjDebuggerTabRecording">' + getRecordingInfo() + '</div>' +
        '   <div class="_hjDebuggerTab" id="_hjDebuggerTabForms">' + getFormInfo() + '</div>' +
        '   <div class="_hjDebuggerTab" id="_hjDebuggerTabPolls">' + getPollInfo() + '</div>' +
        '   <div class="_hjDebuggerTab" id="_hjDebuggerTabSurveys">' + getSurveyInfo() + '</div>' +
        '   <div class="_hjDebuggerTab" id="_hjDebuggerTabRecruiters">' + getTesterInfo() + '</div>' +
        '</div>'
      );
      setTimeout(function () {

        if (hj.cookie.get('_hjDebuggerPosition')) {
          var pos = hj.cookie.get('_hjDebuggerPosition').split(',');
          $('#_hjDebuggerMain').css({
            right: 'auto',
            left: pos[0] + 'px',
            top: pos[1] + 'px'
          });
        }
        jQuery('#_hjDebuggerMain').addClass('loaded');

        // Mark debugger as done
        setTimeout(function () {
          jQuery('#_hjDebuggerMain').addClass('done');
        }, 500);

        jQuery('._hjDebuggerSection').click(function () {
          var tab = jQuery(this).attr('id').replace('_hjDebuggerSection', '_hjDebuggerTab');
          jQuery('._hjDebuggerSection').removeClass('open');
          jQuery(this).addClass('open');
          jQuery('._hjDebuggerTab').slideUp('fast');
          jQuery('#' + tab).slideDown('fast');
        });

        jQuery("#_hjDebuggerMain").draggable({
          containment: "window",
          handle: '#_hjDebuggerWindowTitle',
          stop: function (event, ui) {
            hj.cookie.set('_hjDebuggerPosition', ui.position.left + ',' + ui.position.top)
          },
          scroll: false
        });
        // Set up click events for triggers
        jQuery('._hjTriggerLink').on('click', function (e) {
          e.preventDefault();
          var trigger = jQuery(this).data('trigger');
          hj('trigger', trigger);
        });

        jQuery('._hjFormFieldAttributeButton').click(function (e) {
          e.preventDefault();
          if (jQuery(this).text().indexOf('Show') >= 0) {
            jQuery(this).parents('ul').find('._hjFormFieldAttribute').slideDown('fast');
            jQuery(this).text(jQuery(this).text().replace('Show', 'Hide'));
          } else {
            jQuery(this).parents('ul').find('._hjFormFieldAttribute').slideUp('fast');
            jQuery(this).text(jQuery(this).text().replace('Hide', 'Show'));
          }

        })

        jQuery('body').on('click', '._hjButton', function (e) {
          e.preventDefault();
          var data = jQuery(this).data('formid');
          if (jQuery(this).text().indexOf('Show') >= 0) {
            jQuery(this).parents('ul').find('._hjSlide[data-formid=' + data + ']').slideDown('fast');
            jQuery(this).text(jQuery(this).text().replace('Show', 'Hide'));
          } else {
            jQuery(this).parents('ul').find('._hjSlide[data-formid=' + data + ']').slideUp('fast');
            jQuery(this).text(jQuery(this).text().replace('Hide', 'Show'));
          }

        })
      }, 10);

    })();
  }

  var getGeneralInfo = function () {
    var heightWarning = '';
    var bodyWindowDiff = Math.abs(jQuery('body').height() - jQuery(window).height());
    if (bodyWindowDiff < 50) heightWarning = ' <span style="color: red;">WARNING!</span>';
    var ret = '<ul>' +
      ' <li><strong>Site Id</strong><a href="https://insights.hotjar.com/sites/' + _hjSettings.hjid + '/dashboard" target="_blank">' + _hjSettings.hjid + '</a></li>' +
      ' <li><strong>Version</strong>' + _hjSettings.hjsv + '</li>' +
      ' <li><strong>Body height</strong>' + jQuery('body').height() + 'px' + heightWarning + '</li>' +
      ' <li><strong>Window height</strong>' + jQuery(window).height() + 'px' + heightWarning + '</li>' +
      ' <li><strong>R-value</strong>' + hjSiteSettings.r + '</li>' +
      ' <li><strong>In sample</strong>' + (hj.includedInSample ? 'Yes' : 'No');
    if (!hj.includedInSample) {
      ret += ' &nbsp; <a href="#" class="hjDebuggerButton" id="hjDebuggerSetIncludeCookie">Set cookie</a>';
      setTimeout(function () {
        $('#hjDebuggerSetIncludeCookie').click(function () {
          hj.cookie.set('_hjIncludedInSample', '1');
        });
      }, 10);
    }
    ret += '        </li>' +
      '</ul>';
    return ret;
  };
  var getHeatmapInfo = function () {
    var ret = '<ul>';
    jQuery(hjSiteSettings.heatmaps).each(function (i, e) {
      ret += '<li><h4>Heatmap ' + (i + 1) + '</h4></li>' + displayTarget(e.targeting[0]);
    });
    ret += '</ul>';
    if (hjSiteSettings.heatmaps.length == 0) ret = 'No heatmaps';
    return ret;
  };
  var getRecordingInfo = function () {
    var ret = '<ul>' +
      ' <li><strong>Recordings</strong>' + (hjSiteSettings.record == true ? 'On' : 'Off') + '</li>';
    if (hjSiteSettings.record_targeting_rules.length > 0) {
      jQuery(hjSiteSettings.record_targeting_rules).each(function (i, e) {
        ret += '<li><h5>Target ' + (i + 1) + '</h5></li>' + displayTarget(e);
      });
    }
    ret += '</ul>';
    return ret;
  };
  var getFormInfo = function () {
    var ret = '';
    jQuery(hjSiteSettings.forms).each(function (i, e) {
      var isThisPage = e.targeting[0].pattern === window.location.href ? 'yes' : 'no';
      var selector = e.selector;
      switch (e.selector_type) {
        case 'id':
          selector = '#' + selector;
          break;
        case 'css':
          selector = selector.substr(2);
          break;
      }
      var isPresent = jQuery(selector).length > 0 ? 'yes' : 'no';
      ret += '<ul>' +
        '<li><h4>Form ' + (i + 1) + '</h4></li>' +
        '<li><strong>Selector</strong>' + e.selector + '</li>' +
        '<li><strong>Sel. type</strong>' + e.selector_type + '</li>' +
        displayTarget(e.targeting[0]);
      // check this page is the right one
      ret += '<li style="color: ';
      ret += isThisPage === 'yes' ? 'green' : 'red';
      ret += ';"><strong>Correct Page</strong>' + isThisPage + '</li>';
      ret += '<li class="_hjSlide" data-formid="tooltip" style="display: none; font-weight: bold; color: orange;">This shows that the current page is the page that this form should be present on</li>';
      // Check form is on this page
      ret += '<li style="color: ';
      ret += isPresent === 'yes' ? 'green' : 'red'
      ret += ';"><strong>Form is present</strong>' + isPresent + '</li>';
      ret += '<li class="_hjSlide" data-formid="tooltip" style="display: none; font-weight: bold; color: orange;">This shows whether this form is present on the page</li>';
      ret += '<li><a href="#" class="_hjButton" data-formid="tooltip">Show help text</a></li>';
      jQuery(e.field_info).each(function (fi, fe) {
        ret += '<li class="_hjFormFieldAttribute"><h5>Field ' + (fi + 1) + '</h5></li>' +
          '<li class="_hjFormFieldAttribute"><strong>Type</strong>' + fe.field_type + '</li>' +
          '<li class="_hjFormFieldAttribute"><strong>Match</strong>' + fe.match_attribute + ': ' + fe.match_value + '</li>';
      });

      ret += '<li><a href="#" class="_hjFormFieldAttributeButton">Show fields (' + e.field_info.length + ')</a></li>';
      ret += '</ul>';
    });
    if (hjSiteSettings.forms.length == 0) {
      ret = 'No forms yet<br />';
    }
    ret += '<hr />';
    ret += showFormProblems();
    return ret;
  };

  // show forms laoded with JS and HTML errors
  var showFormProblems = function () {
    var ret = '';
    ret += '<ul>' +
      ' <li><h4>Forms Loaded with Javascript</h4></li>' +
      ' <li id="_hjJSFormError" style="color: red;"></li>' +
      ' <hr />' +
      ' <li><h4>HTML Errors</h4></li>' +
      ' <li id="_hjHTMLErrors"><strong>Errors:</strong> <span id="_hjErrorCount"></span></li>' +
      ' <li id="_hjKnownIssues"><h5 id="_hjKnownIssuesCount" style="font-weight: bold; color: orange; font-weight: bold;"></h5></li>' +
      '</ul>' +
      '<hr />' +
      listForms();
    getHTMLErrorCount();
    return ret;
  };

  // list all forms on page
  var listForms = function () {
    var ret = '<ul><li><h4>Page forms</h4></li>';
    jQuery('form').each(function (n) {
      var showId = jQuery(this).attr('id') ? jQuery(this).attr('id') : 'none';
      var showClass = jQuery(this).hasClass() ? jQuery(this).attr('class') : 'none';
      var showInputs = jQuery(this).find('input').length;
      var hasSubmit = jQuery(this).find('input[type="submit"]').length > 0 ? 'yes' : 'no';
      ret += '<li><ul>';
      ret += '<li><h5>Form ' + (n + 1) + '</h5></li>';
      ret += '<li><strong>ID:</strong> ' + showId;
      // is form ID unique
      if (showId !== 'none' && jQuery('[id="' + showId + '"]').length > 0) {
        ret += '<span style="color: orange; font-weight: bold; margin-left: 20px;">This ID is not unique!</span>';
      }
      ret += '</li >';
      ret += '<li><strong>Class:</strong> ' + showClass + '</li>';
      ret += '<li><strong>Inputs:</strong> ' + showInputs + '</li>';
      // does form have a HTML input type="submit"
      ret += hasSubmit === 'yes' ? '<li style="color: green;">This form has an input of type submit</li>' : '<li style="color: red;">This form doesn\'t have an input of type submit. It may submit with Javascript!</li>';
      ret += '</li></ul>';
    });
    ret += '</ul>';
    return ret;
  }

  // Bank of known issues
  var knownIssues = [
    'Duplicate ID',
    'unclosed elements',
    'Stray end tag'
  ];

  // Show any known issues that are present
  var showKnownIssues = function (errors) {
    var knownIssuesPresent = [];
    errors.forEach(function (error) {
      knownIssues.forEach(function (issue) {
        if (error.message.includes(issue)) {
          knownIssuesPresent.push(error.message);
        }
      })
    })
    jQuery('#_hjKnownIssuesCount').append(knownIssuesPresent.length + ' known issues');
    var ret = '<li><a href="#" class="_hjButton" data-formid="knownIssues">Show known issues</a></li>' +
      '<li><ul>' +
      knownIssuesPresent.map(function (issue) {
        return ('<li class="_hjSlide" data-formid="knownIssues" style="display: none; color: orange; font-weight: bold; margin-left: 10px;">' + issue + '</li>');
      }).join('');
    ret += '</ul></li>';
    jQuery('#_hjKnownIssuesCount').after(ret);
  }

  // check original source for a form
  var checkSourceForForm = function (form, source) {
    var sourceStripped = source.replace(/\s/g, '').replace(/\r/g, '').replace(/\s\n/g, '').replace(/\//g, '');
    var formStripped = form[0].outerHTML.replace(/\s/g, '').replace(/\r/g, '').replace(/\s\n/g, '').replace(/\//g, '');
    if (!sourceStripped.includes(formStripped)) {
      var id = form[0].id !== '' ? form[0].id : 'none';
      var className = form[0].className !== '' ? form[0].className : 'none';
      var children = form[0].childElementCount;
      var ret = '<li><ul>' +
        ' <li><h5>JS Form ' + (jQuery('#_hjErrorShowMore ul li').length + 1) + '</h5></li>' +
        ' <li><strong>ID:</strong>' + id + '</li>' +
        ' <li><strong>Class:</strong>' + className + '</li>' +
        ' <li><strong>Children:</strong>' + children + '</li>' +
        '</ul></li>';
      jQuery('#_hjErrorShowMore ul').append(ret);
    }
  }

  // create link for ajax request
  var getHTMLErrorLink = function (type = '') {
    var doc = encodeURIComponent(window.location.href);
    var url = 'https://validator.w3.org/nu/?doc=' + doc
    if (type) url += '&out=' + type + '&showsource=true';
    return url;
  };

  // ajax call to W3c Validator for HTML errors and original source
  var getHTMLErrorCount = function () {
    jQuery.ajax({
      url: getHTMLErrorLink('json'),
      type: 'GET',
      success: function (res) {
        // HTML errors
        jQuery('#_hjErrorCount').append(res.messages.length);
        showKnownIssues(res.messages);
        if (res.messages.length > 0) {
          jQuery('#_hjHTMLErrors').append('<br /><a href="' + getHTMLErrorLink() + '">See errors here</a>');
        }
        // forms added by JS
        jQuery('#_hjSourceForms').append(res.source.code.match(/<form/g).length);
        if (jQuery('form').length > res.source.code.match(/<form/g).length) {
          var formDiff = jQuery('form').length - res.source.code.match(/<form/g).length;
          var ret = formDiff;
          ret += formDiff === 1 ? ' form' : ' forms';
          ret += ' on this page ';
          ret += formDiff === 1 ? 'isn\'t' : 'aren\'t';
          ret += ' in the source. ';
          ret += formDiff === 1 ? 'It' : 'They';
          ret += ' may be rendered via Javascript!';
          jQuery('#_hjJSFormError').append(ret);
          jQuery('#_hjJSFormError').after('<li id="_hjErrorShowMore"><a href="#">Show JS-loaded forms</a></li>');
          jQuery('#_hjErrorShowMore').prepend('<ul style="display: none;"></ul>');
          jQuery('#_hjErrorShowMore a').click(function (e) {
            e.preventDefault();
            if (jQuery(this).text().indexOf('Show') >= 0) {
              jQuery(this).parents('li').find('ul').slideDown('fast');
              jQuery(this).text(jQuery(this).text().replace('Show', 'Hide'));
            } else {
              jQuery(this).parents('li').find('ul').slideUp('fast');
              jQuery(this).text(jQuery(this).text().replace('Hide', 'Show'));
            }
          })
          jQuery('form').each(function (n) {
            checkSourceForForm(jQuery(this), res.source.code);
          })
        }
      },
      error: function () {
        jQuery('#_hjErrorCount').append('unknown');
      }
    })
  };

  var getPollInfo = function () {
    var ret = '';
    jQuery(hjSiteSettings.polls).each(function (i, e) {
      ret += '<ul>' +
        '<li><h4>Poll ' + (i + 1) + '</h4></li>' +
        '<li><strong>Id</strong>' + e.id + '</li>' +
        '<li><strong>Disp. condition</strong>' + e.display_condition + '</li>' +
        '<li><strong>Disp. delay</strong>' + e.display_delay + '</li>' +
        '<li><strong>Show branding</strong>' + (e.effective_show_branding == true ? 'Yes' : 'No') + '</li>' +
        '<li><strong>Language</strong>' + e.language + '</li>' +
        '<li><strong>Position</strong>' + e.position + '</li>' +
        '<li><strong>Skin</strong>' + e.skin + '</li>';
      jQuery(e.targeting).each(function (fi, fe) {
        ret += '<li><h5>Target ' + (fi + 1) + '</h5></li>' + displayTarget(fe);
      });
      jQuery(e.content.questions).each(function (fi, fe) {
        ret += '<li class="_hjFormFieldAttribute"><h5>Question ' + (fi + 1) + '</h5></li>' +
          '<li class="_hjFormFieldAttribute"><strong>Type</strong>' + fe.type + '</li>' +
          '<li class="_hjFormFieldAttribute"><strong>Text</strong>' + fe.text + '</li>' +
          '<li class="_hjFormFieldAttribute"><strong>Answers</strong><br /><ul>';
        jQuery(fe.answers).each(function (ai, ae) {
          ret += '<li class="_hjFormFieldAttribute">' + ae.text + '</li>';
        });
        ret += '</ul></li>' +
          '<li class="_hjFormFieldAttribute"><strong>Labels</strong>' + fe.labels + '</li>';
      });
      ret += '<li><a href="#" class="_hjFormFieldAttributeButton">Show questions (' + e.content.questions.length + ')</a></li>';
      ret += '</ul>';
    });
    if (hjSiteSettings.polls.length == 0) ret = 'No polls';
    return ret;
  };
  var getSurveyInfo = function () {
    var ret = '';
    jQuery(hjSiteSettings.surveys).each(function (i, e) {
      ret += '<ul>' +
        '<li><h4>Survey ' + (i + 1) + '</h4></li>' +
        '<li><strong>Disp. condition</strong>' + e.display_condition + '</li>' +
        '<li><strong>Disp. delay</strong>' + e.display_delay + '</li>' +
        '<li><strong>Show branding</strong>' + (e.effective_show_branding == true ? 'Yes' : 'No') + '</li>' +
        '<li><strong>Language</strong>' + e.language + '</li>';
      jQuery(e.targeting).each(function (fi, fe) {
        ret += '<li><h5>Target ' + (fi + 1) + '</h5></li>' + displayTarget(fe);
      });
    });
    ret += '</ul>';
    if (hjSiteSettings.polls.length == 0) ret = 'No surveys';
    return ret;
  };
  var getTesterInfo = function () {
    var ret = '';
    jQuery(hjSiteSettings.testers_widgets).each(function (i, e) {
      ret += '<ul>' +
        '<li><h4>Recruiter ' + (i + 1) + '</h4></li>' +
        '<li><strong>Disp. condition</strong>' + e.display_condition + '</li>' +
        '<li><strong>Disp. delay</strong>' + e.display_delay + '</li>' +
        '<li><strong>Show branding</strong>' + (e.effective_show_branding == true ? 'Yes' : 'No') + '</li>' +
        '<li><strong>Language</strong>' + e.language + '</li>' +
        '<li><strong>Position</strong>' + e.position + '</li>' +
        '<li><strong>Skin</strong>' + e.skin + '</li>';
      jQuery(e.targeting).each(function (fi, fe) {
        ret += '<li><h5>Target ' + (fi + 1) + '</h5></li>' + displayTarget(fe);
      });
    });
    ret += '</ul>';
    if (hjSiteSettings.testers_widgets.length == 0) ret = 'No recruiters';
    return ret;
  };

  var displayTarget = function (target) {
    var ret = '<li><strong>Component</strong>' + target.component + '</li>' +
      '<li><strong>Match</strong>' + target.match_operation + ': ' + target.pattern + '</li>';
    if (target.component == 'trigger') {
      ret += '<li><a href="#" data-trigger="' + target.pattern + '" class="_hjTriggerLink">Run trigger</a></li>';
    }
    return ret;
  };
})();
