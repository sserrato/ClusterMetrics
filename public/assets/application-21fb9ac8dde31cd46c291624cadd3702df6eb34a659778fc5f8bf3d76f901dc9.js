/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */


if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.5
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
/*!
 * jQuery JavaScript Library v1.11.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:19Z
 */


(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var deletedIds = [];

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	version = "1.11.3",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1, IE<9
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: deletedIds.sort,
	splice: deletedIds.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( support.ownLast ) {
			for ( key in obj ) {
				return hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1, IE<9
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( indexOf ) {
				return indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		while ( j < len ) {
			first[ i++ ] = second[ j++ ];
		}

		// Support: IE<9
		// Workaround casting of .length to NaN on otherwise arraylike objects (e.g., NodeLists)
		if ( len !== len ) {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: function() {
		return +( new Date() );
	},

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];
	nodeType = context.nodeType;

	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	if ( !seed && documentIsHTML ) {

		// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
		if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType !== 1 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;
	parent = doc.defaultView;

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Support tests
	---------------------------------------------------------------------- */
	documentIsHTML = !isXML( doc );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\f]' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );

					} else if ( !(--remaining) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * Clean-up method for dom ready events
 */
function detach() {
	if ( document.addEventListener ) {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );

	} else {
		document.detachEvent( "onreadystatechange", completed );
		window.detachEvent( "onload", completed );
	}
}

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	// readyState === "complete" is good enough for us to call the dom ready in oldIE
	if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
		detach();
		jQuery.ready();
	}
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};


var strundefined = typeof undefined;



// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownLast = i !== "0";

// Note: most support tests are defined in their respective modules.
// false until the test is run
support.inlineBlockNeedsLayout = false;

// Execute ASAP in case we need to set body.style.zoom
jQuery(function() {
	// Minified: var a,b,c,d
	var val, div, body, container;

	body = document.getElementsByTagName( "body" )[ 0 ];
	if ( !body || !body.style ) {
		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div = document.createElement( "div" );
	container = document.createElement( "div" );
	container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
	body.appendChild( container ).appendChild( div );

	if ( typeof div.style.zoom !== strundefined ) {
		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";

		support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
		if ( val ) {
			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );
});




(function() {
	var div = document.createElement( "div" );

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( elem ) {
	var noData = jQuery.noData[ (elem.nodeName + " ").toLowerCase() ],
		nodeType = +elem.nodeType || 1;

	// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
	return nodeType !== 1 && nodeType !== 9 ?
		false :

		// Nodes accept data unless otherwise specified; rejection can be conditional
		!noData || noData !== true && elem.getAttribute("classid") === noData;
};


var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}

function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements (space-suffixed to avoid Object.prototype collisions)
	// throw uncatchable exceptions if you attempt to set expando properties
	noData: {
		"applet ": true,
		"embed ": true,
		// ...but Flash objects (which have this classid) *can* handle expandos
		"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[0],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};



// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		length = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < length; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			length ? fn( elems[0], key ) : emptyGet;
};
var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	// Minified: var a,b,c
	var input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		fragment = document.createDocumentFragment();

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE6-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );
	div.innerHTML = "<input type='radio' checked='checked' name='t'/>";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	support.noCloneEvent = true;
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}
	}
})();


(function() {
	var i, eventName,
		div = document.createElement( "div" );

	// Support: IE<9 (lack submit/change bubble), Firefox 23+ (lack focusin event)
	for ( i in { submit: true, change: true, focusin: true }) {
		eventName = "on" + i;

		if ( !(support[ i + "Bubbles" ] = eventName in window) ) {
			// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
			div.setAttribute( eventName, "t" );
			support[ i + "Bubbles" ] = div.attributes[ eventName ].expando === false;
		}
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();


var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: IE < 9, Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				jQuery._data( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = jQuery._data( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					jQuery._removeData( doc, fix );
				} else {
					jQuery._data( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!support.noCloneEvent || !support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = (rtagName.exec( elem ) || [ "", "" ])[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						deletedIds.push( id );
					}
				}
			}
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ (rtagName.exec( value ) || [ "", "" ])[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}


(function() {
	var shrinkWrapBlocksVal;

	support.shrinkWrapBlocks = function() {
		if ( shrinkWrapBlocksVal != null ) {
			return shrinkWrapBlocksVal;
		}

		// Will be changed later if needed.
		shrinkWrapBlocksVal = false;

		// Minified: var b,c,d
		var div, body, container;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		// Support: IE6
		// Check if elements with layout shrink-wrap their children
		if ( typeof div.style.zoom !== strundefined ) {
			// Reset CSS: box-sizing; display; margin; border
			div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;" +
				"padding:1px;width:1px;zoom:1";
			div.appendChild( document.createElement( "div" ) ).style.width = "5px";
			shrinkWrapBlocksVal = div.offsetWidth !== 3;
		}

		body.removeChild( container );

		return shrinkWrapBlocksVal;
	};

})();
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );



var getStyles, curCSS,
	rposition = /^(top|right|bottom|left)$/;

if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		if ( elem.ownerDocument.defaultView.opener ) {
			return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
		}

		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "";
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, computed ) {
		var left, rs, rsLeft, ret,
			style = elem.style;

		computed = computed || getStyles( elem );
		ret = computed ? computed[ name ] : undefined;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		// Support: IE
		// IE returns zIndex value as an integer.
		return ret === undefined ?
			ret :
			ret + "" || "auto";
	};
}




function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			var condition = conditionFn();

			if ( condition == null ) {
				// The test was not ready at this point; screw the hook this time
				// but check again when needed next time.
				return;
			}

			if ( condition ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	// Minified: var b,c,d,e,f,g, h,i
	var div, style, a, pixelPositionVal, boxSizingReliableVal,
		reliableHiddenOffsetsVal, reliableMarginRightVal;

	// Setup
	div = document.createElement( "div" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName( "a" )[ 0 ];
	style = a && a.style;

	// Finish early in limited (non-browser) environments
	if ( !style ) {
		return;
	}

	style.cssText = "float:left;opacity:.5";

	// Support: IE<9
	// Make sure that element opacity exists (as opposed to filter)
	support.opacity = style.opacity === "0.5";

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!style.cssFloat;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: Firefox<29, Android 2.3
	// Vendor-prefix box-sizing
	support.boxSizing = style.boxSizing === "" || style.MozBoxSizing === "" ||
		style.WebkitBoxSizing === "";

	jQuery.extend(support, {
		reliableHiddenOffsets: function() {
			if ( reliableHiddenOffsetsVal == null ) {
				computeStyleTests();
			}
			return reliableHiddenOffsetsVal;
		},

		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},

		pixelPosition: function() {
			if ( pixelPositionVal == null ) {
				computeStyleTests();
			}
			return pixelPositionVal;
		},

		// Support: Android 2.3
		reliableMarginRight: function() {
			if ( reliableMarginRightVal == null ) {
				computeStyleTests();
			}
			return reliableMarginRightVal;
		}
	});

	function computeStyleTests() {
		// Minified: var b,c,d,j
		var div, body, container, contents;

		body = document.getElementsByTagName( "body" )[ 0 ];
		if ( !body || !body.style ) {
			// Test fired too early or in an unsupported environment, exit.
			return;
		}

		// Setup
		div = document.createElement( "div" );
		container = document.createElement( "div" );
		container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
		body.appendChild( container ).appendChild( div );

		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";

		// Support: IE<9
		// Assume reasonable values in the absence of getComputedStyle
		pixelPositionVal = boxSizingReliableVal = false;
		reliableMarginRightVal = true;

		// Check for getComputedStyle so that this code is not run in IE<9.
		if ( window.getComputedStyle ) {
			pixelPositionVal = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			boxSizingReliableVal =
				( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			contents = div.appendChild( document.createElement( "div" ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			contents.style.cssText = div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
				"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
			contents.style.marginRight = contents.style.width = "0";
			div.style.width = "1px";

			reliableMarginRightVal =
				!parseFloat( ( window.getComputedStyle( contents, null ) || {} ).marginRight );

			div.removeChild( contents );
		}

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		contents = div.getElementsByTagName( "td" );
		contents[ 0 ].style.cssText = "margin:0;border:0;padding:0;display:none";
		reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
		if ( reliableHiddenOffsetsVal ) {
			contents[ 0 ].style.display = "";
			contents[ 1 ].style.display = "none";
			reliableHiddenOffsetsVal = contents[ 0 ].offsetHeight === 0;
		}

		body.removeChild( container );
	}

})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
		ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,

	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];


// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display && display !== "none" || !hidden ) {
				jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Support: IE
				// Swallow errors from 'invalid' CSS values (#5509)
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			jQuery._data( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";
			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !support.shrinkWrapBlocks() ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	// Minified: var a,b,c,d,e
	var input, div, select, a, opt;

	// Setup
	div = document.createElement( "div" );
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	a = div.getElementsByTagName("a")[ 0 ];

	// First batch of tests.
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE8 only
	// Check if we can trust getAttribute("value")
	input = document.createElement( "input" );
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";
})();


var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					if ( jQuery.inArray( jQuery.valHooks.option.get( option ), values ) >= 0 ) {

						// Support: IE6
						// When new option element is added to select box we need to
						// force reflow of newly added node in order to workaround delay
						// of initialization properties
						try {
							option.selected = optionSet = true;

						} catch ( _ ) {

							// Will be executed only in IE6
							option.scrollHeight;
						}

					} else {
						option.selected = false;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}

				return options;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = support.getSetAttribute,
	getSetInput = support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// Retrieve booleans specially
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {

	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		} :
		function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
			}
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			if ( name === "value" || value === elem.getAttribute( name ) ) {
				return value;
			}
		}
	};

	// Some attributes are constructed with empty-string values when not defined
	attrHandle.id = attrHandle.name = attrHandle.coords =
		function( elem, name, isXML ) {
			var ret;
			if ( !isXML ) {
				return (ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
			}
		};

	// Fixing value retrieval on a button requires this module
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			if ( ret && ret.specified ) {
				return ret.value;
			}
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}

if ( !support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}




var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

// Support: Safari, IE9+
// mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

jQuery.parseJSON = function( data ) {
	// Attempt to parse using the native JSON parser first
	if ( window.JSON && window.JSON.parse ) {
		// Support: Android 2.3
		// Workaround failure to string-cast null input
		return window.JSON.parse( data + "" );
	}

	var requireNonComma,
		depth = null,
		str = jQuery.trim( data + "" );

	// Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
	// after removing valid tokens
	return str && !jQuery.trim( str.replace( rvalidtokens, function( token, comma, open, close ) {

		// Force termination if we see a misplaced comma
		if ( requireNonComma && comma ) {
			depth = 0;
		}

		// Perform no more replacements after returning to outermost depth
		if ( depth === 0 ) {
			return token;
		}

		// Commas must not follow "[", "{", or ","
		requireNonComma = open || comma;

		// Determine new depth
		// array/object open ("[" or "{"): depth += true - false (increment)
		// array/object close ("]" or "}"): depth += false - true (decrement)
		// other cases ("," or primitive): depth += true - true (numeric cast)
		depth += !close - !open;

		// Remove this token
		return "";
	}) ) ?
		( Function( "return " + str ) )() :
		jQuery.error( "Invalid JSON: " + data );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	try {
		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}
	} catch( e ) {
		xml = undefined;
	}
	if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType.charAt( 0 ) === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
		(!support.reliableHiddenOffsets() &&
			((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?
	// Support: IE6+
	function() {

		// XHR cannot access local files, always use ActiveX for that case
		return !this.isLocal &&

			// Support: IE7-8
			// oldIE XHR does not support non-RFC2616 methods (#13240)
			// See http://msdn.microsoft.com/en-us/library/ie/ms536648(v=vs.85).aspx
			// and http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9
			// Although this check for six methods instead of eight
			// since IE also does not support "trace" and "connect"
			/^(get|post|head|put|delete|options)$/i.test( this.type ) &&

			createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

var xhrId = 0,
	xhrCallbacks = {},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE<10
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	});
}

// Determine support properties
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( options ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !options.crossDomain || support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;

					// Open the socket
					xhr.open( options.type, options.url, options.async, options.username, options.password );

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						// Support: IE<9
						// IE's ActiveXObject throws a 'Type Mismatch' exception when setting
						// request header to a null-value.
						//
						// To keep consistent with other XHR implementations, cast the value
						// to string and ignore `undefined`.
						if ( headers[ i ] !== undefined ) {
							xhr.setRequestHeader( i, headers[ i ] + "" );
						}
					}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( options.hasContent && options.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, statusText, responses;

						// Was never called and is aborted or complete
						if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
							// Clean up
							delete xhrCallbacks[ id ];
							callback = undefined;
							xhr.onreadystatechange = jQuery.noop;

							// Abort manually if needed
							if ( isAbort ) {
								if ( xhr.readyState !== 4 ) {
									xhr.abort();
								}
							} else {
								responses = {};
								status = xhr.status;

								// Support: IE<10
								// Accessing binary-data responseText throws an exception
								// (#11426)
								if ( typeof xhr.responseText === "string" ) {
									responses.text = xhr.responseText;
								}

								// Firefox throws an exception when accessing
								// statusText for faulty cross-domain requests
								try {
									statusText = xhr.statusText;
								} catch( e ) {
									// We normalize with Webkit giving an empty statusText
									statusText = "";
								}

								// Filter status for non standard behaviors

								// If the request is local and we have data: assume a success
								// (success with no data won't get notified, that's the best we
								// can do given current implementations)
								if ( !status && options.isLocal && !options.crossDomain ) {
									status = responses.text ? 200 : 404;
								// IE - #1450: sometimes returns 1223 when it should be 204
								} else if ( status === 1223 ) {
									status = 204;
								}
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, xhr.getAllResponseHeaders() );
						}
					};

					if ( !options.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						// Add to the list of active xhr callbacks
						xhr.onreadystatechange = xhrCallbacks[ id ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off, url.length ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};





var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			jQuery.inArray("auto", [ curCSSTop, curCSSLeft ] ) > -1;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			box = { top: 0, left: 0 },
			elem = this[ 0 ],
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
			left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  'use strict';

  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with], a[data-disable]',

    // Button elements bound by jquery-ujs
    buttonClickSelector: 'button[data-remote]:not(form button), button[data-confirm]:not(form button)',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]:not([disabled])',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with], a[data-disable]',

    // Button onClick disable selector with possible reenable after remote submission
    buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]',

    // Up-to-date Cross-Site Request Forgery token
    csrfToken: function() {
     return $('meta[name=csrf-token]').attr('content');
    },

    // URL param that must contain the CSRF token
    csrfParam: function() {
     return $('meta[name=csrf-param]').attr('content');
    },

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = rails.csrfToken();
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // making sure that all forms have actual up-to-date token(cached forms contain old one)
    refreshCSRFTokens: function(){
      $('form input[name="' + rails.csrfParam() + '"]').val(rails.csrfToken());
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element[0].href;
    },

    // Checks "data-remote" if true to handle the request through a XHR request.
    isRemote: function(element) {
      return element.data('remote') !== undefined && element.data('remote') !== false;
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + '&' + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            if (rails.fire(element, 'ajax:beforeSend', [xhr, settings])) {
              element.trigger('ajax:send', xhr);
            } else {
              return false;
            }
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: rails.isCrossDomain(url)
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Determines if the request is a cross domain request.
    isCrossDomain: function(url) {
      var originAnchor = document.createElement('a');
      originAnchor.href = location.href;
      var urlAnchor = document.createElement('a');

      try {
        urlAnchor.href = url;
        // This is a workaround to a IE bug.
        urlAnchor.href = urlAnchor.href;

        // If URL protocol is false or is a string containing a single colon
        // *and* host are false, assume it is not a cross-domain request
        // (should only be the case for IE7 and IE compatibility mode).
        // Otherwise, evaluate protocol and host of the URL against the origin
        // protocol and host.
        return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
          (originAnchor.protocol + '//' + originAnchor.host ===
            urlAnchor.protocol + '//' + urlAnchor.host));
      } catch (e) {
        // If there is an error parsing the URL, assume it is crossDomain.
        return true;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrfToken = rails.csrfToken(),
        csrfParam = rails.csrfParam(),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadataInput = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrfParam !== undefined && csrfToken !== undefined && !rails.isCrossDomain(href)) {
        metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadataInput).appendTo('body');
      form.submit();
    },

    // Helper function that returns form elements that match the specified CSS selector
    // If form is actually a "form" element this will return associated elements outside the from that have
    // the html form attribute set
    formElements: function(form, selector) {
      return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      rails.formElements(form, rails.disableSelector).each(function() {
        rails.disableFormElement($(this));
      });
    },

    disableFormElement: function(element) {
      var method, replacement;

      method = element.is('button') ? 'html' : 'val';
      replacement = element.data('disable-with');

      element.data('ujs:enable-with', element[method]());
      if (replacement !== undefined) {
        element[method](replacement);
      }

      element.prop('disabled', true);
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      rails.formElements(form, rails.enableSelector).each(function() {
        rails.enableFormElement($(this));
      });
    },

    enableFormElement: function(element) {
      var method = element.is('button') ? 'html' : 'val';
      if (typeof element.data('ujs:enable-with') !== 'undefined') element[method](element.data('ujs:enable-with'));
      element.prop('disabled', false);
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        try {
          answer = rails.confirm(message);
        } catch (e) {
          (console.error || console.log).call(console, e.stack || e);
        }
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val();
        if (valueToCheck === nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      var replacement = element.data('disable-with');

      element.data('ujs:enable-with', element.html()); // store enabled state
      if (replacement !== undefined) {
        element.html(replacement);
      }

      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }
  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    //
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    $(window).on('pageshow.rails', function () {
      $($.rails.enableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:enable-with')) {
          $.rails.enableFormElement(element);
        }
      });

      $($.rails.linkDisableSelector).each(function () {
        var element = $(this);

        if (element.data('ujs:enable-with')) {
          $.rails.enableElement(element);
        }
      });
    });

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.buttonDisableSelector, 'ajax:complete', function() {
        rails.enableFormElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey;
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (!metaClick && link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (rails.isRemote(link)) {
        if (metaClick && (!method || method === 'GET') && !data) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.fail( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (method) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);

      if (!rails.allowAction(button) || !rails.isRemote(button)) return rails.stopEverything(e);

      if (button.is(rails.buttonDisableSelector)) rails.disableFormElement(button);

      var handleRemote = rails.handleRemote(button);
      // response from rails.handleRemote() will either be false or a deferred object promise.
      if (handleRemote === false) {
        rails.enableFormElement(button);
      } else {
        handleRemote.fail( function() { rails.enableFormElement(button); } );
      }
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link) || !rails.isRemote(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = rails.isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs;

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (form.attr('novalidate') === undefined) {
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector, false);
        if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
          return rails.stopEverything(e);
        }
      }

      if (remote) {
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:send.rails', function(event) {
      if (this === event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this === event.target) rails.enableFormElements($(this));
    });

    $(function(){
      rails.refreshCSRFTokens();
    });
  }

})( jQuery );
(function() {
  var CSRFToken, Click, ComponentUrl, EVENTS, Link, ProgressBar, browserIsntBuggy, browserSupportsCustomEvents, browserSupportsPushState, browserSupportsTurbolinks, bypassOnLoadPopstate, cacheCurrentPage, cacheSize, changePage, clone, constrainPageCacheTo, createDocument, crossOriginRedirect, currentState, enableProgressBar, enableTransitionCache, executeScriptTags, extractTitleAndBody, fetch, fetchHistory, fetchReplacement, historyStateIsDefined, initializeTurbolinks, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, manuallyTriggerHashChangeForFirefox, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, progressBar, recallScrollPosition, ref, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, setAutofocusElement, transitionCacheEnabled, transitionCacheFor, triggerEvent, visit, xhr,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  pageCache = {};

  cacheSize = 10;

  transitionCacheEnabled = false;

  progressBar = null;

  currentState = null;

  loadedAssets = null;

  referer = null;

  xhr = null;

  EVENTS = {
    BEFORE_CHANGE: 'page:before-change',
    FETCH: 'page:fetch',
    RECEIVE: 'page:receive',
    CHANGE: 'page:change',
    UPDATE: 'page:update',
    LOAD: 'page:load',
    RESTORE: 'page:restore',
    BEFORE_UNLOAD: 'page:before-unload',
    EXPIRE: 'page:expire'
  };

  fetch = function(url) {
    var cachedPage;
    url = new ComponentUrl(url);
    rememberReferer();
    cacheCurrentPage();
    if (progressBar != null) {
      progressBar.start();
    }
    if (transitionCacheEnabled && (cachedPage = transitionCacheFor(url.absolute))) {
      fetchHistory(cachedPage);
      return fetchReplacement(url, null, false);
    } else {
      return fetchReplacement(url, resetScrollPosition);
    }
  };

  transitionCacheFor = function(url) {
    var cachedPage;
    cachedPage = pageCache[url];
    if (cachedPage && !cachedPage.transitionCacheDisabled) {
      return cachedPage;
    }
  };

  enableTransitionCache = function(enable) {
    if (enable == null) {
      enable = true;
    }
    return transitionCacheEnabled = enable;
  };

  enableProgressBar = function(enable) {
    if (enable == null) {
      enable = true;
    }
    if (!browserSupportsTurbolinks) {
      return;
    }
    if (enable) {
      return progressBar != null ? progressBar : progressBar = new ProgressBar('html');
    } else {
      if (progressBar != null) {
        progressBar.uninstall();
      }
      return progressBar = null;
    }
  };

  fetchReplacement = function(url, onLoadFunction, showProgressBar) {
    if (showProgressBar == null) {
      showProgressBar = true;
    }
    triggerEvent(EVENTS.FETCH, {
      url: url.absolute
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', url.withoutHashForIE10compatibility(), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent(EVENTS.RECEIVE, {
        url: url.absolute
      });
      if (doc = processResponse()) {
        reflectNewUrl(url);
        reflectRedirectedUrl();
        changePage.apply(null, extractTitleAndBody(doc));
        manuallyTriggerHashChangeForFirefox();
        if (typeof onLoadFunction === "function") {
          onLoadFunction();
        }
        return triggerEvent(EVENTS.LOAD);
      } else {
        return document.location.href = crossOriginRedirect() || url.absolute;
      }
    };
    if (progressBar && showProgressBar) {
      xhr.onprogress = (function(_this) {
        return function(event) {
          var percent;
          percent = event.lengthComputable ? event.loaded / event.total * 100 : progressBar.value + (100 - progressBar.value) / 10;
          return progressBar.advanceTo(percent);
        };
      })(this);
    }
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onerror = function() {
      return document.location.href = url.absolute;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent(EVENTS.RESTORE);
  };

  cacheCurrentPage = function() {
    var currentStateUrl;
    currentStateUrl = new ComponentUrl(currentState.url);
    pageCache[currentStateUrl.absolute] = {
      url: currentStateUrl.relative,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset,
      cachedAt: new Date().getTime(),
      transitionCacheDisabled: document.querySelector('[data-no-transition-cache]') != null
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var cacheTimesRecentFirst, i, key, len, pageCacheKeys, results;
    pageCacheKeys = Object.keys(pageCache);
    cacheTimesRecentFirst = pageCacheKeys.map(function(url) {
      return pageCache[url].cachedAt;
    }).sort(function(a, b) {
      return b - a;
    });
    results = [];
    for (i = 0, len = pageCacheKeys.length; i < len; i++) {
      key = pageCacheKeys[i];
      if (!(pageCache[key].cachedAt <= cacheTimesRecentFirst[limit])) {
        continue;
      }
      triggerEvent(EVENTS.EXPIRE, pageCache[key]);
      results.push(delete pageCache[key]);
    }
    return results;
  };

  changePage = function(title, body, csrfToken, runScripts) {
    triggerEvent(EVENTS.BEFORE_UNLOAD);
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    setAutofocusElement();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    if (progressBar != null) {
      progressBar.done();
    }
    triggerEvent(EVENTS.CHANGE);
    return triggerEvent(EVENTS.UPDATE);
  };

  executeScriptTags = function() {
    var attr, copy, i, j, len, len1, nextSibling, parentNode, ref, ref1, script, scripts;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (i = 0, len = scripts.length; i < len; i++) {
      script = scripts[i];
      if (!((ref = script.type) === '' || ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      ref1 = script.attributes;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        attr = ref1[j];
        copy.setAttribute(attr.name, attr.value);
      }
      if (!script.hasAttribute('async')) {
        copy.async = false;
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function(node) {
    node.innerHTML = node.innerHTML.replace(/<noscript[\S\s]*?<\/noscript>/ig, '');
    return node;
  };

  setAutofocusElement = function() {
    var autofocusElement, list;
    autofocusElement = (list = document.querySelectorAll('input[autofocus], textarea[autofocus]'))[list.length - 1];
    if (autofocusElement && document.activeElement !== autofocusElement) {
      return autofocusElement.focus();
    }
  };

  reflectNewUrl = function(url) {
    if ((url = new ComponentUrl(url)).absolute !== referer) {
      return window.history.pushState({
        turbolinks: true,
        url: url.absolute
      }, '', url.absolute);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      location = new ComponentUrl(location);
      preservedHash = location.hasNoHash() ? document.location.hash : '';
      return window.history.replaceState(window.history.state, '', location.href + preservedHash);
    }
  };

  crossOriginRedirect = function() {
    var redirect;
    if (((redirect = xhr.getResponseHeader('Location')) != null) && (new ComponentUrl(redirect)).crossOrigin()) {
      return redirect;
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      url: document.location.href
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  manuallyTriggerHashChangeForFirefox = function() {
    var url;
    if (navigator.userAgent.match(/Firefox/) && !(url = new ComponentUrl).hasNoHash()) {
      window.history.replaceState(currentState, '', url.withoutHash());
      return document.location.hash = url.hash;
    }
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  clone = function(original) {
    var copy, key, value;
    if ((original == null) || typeof original !== 'object') {
      return original;
    }
    copy = new original.constructor();
    for (key in original) {
      value = original[key];
      copy[key] = clone(value);
    }
    return copy;
  };

  popCookie = function(name) {
    var ref, value;
    value = ((ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    if (typeof Prototype !== 'undefined') {
      Event.fire(document, name, data, true);
    }
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function(url) {
    return !triggerEvent(EVENTS.BEFORE_CHANGE, {
      url: url
    });
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var ref;
      return (400 <= (ref = xhr.status) && ref < 600);
    };
    validContent = function() {
      var contentType;
      return ((contentType = xhr.getResponseHeader('Content-Type')) != null) && contentType.match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var i, len, node, ref, results;
      ref = doc.querySelector('head').childNodes;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var i, len, ref, results, value;
      if (a.length > b.length) {
        ref = [b, a], a = ref[0], b = ref[1];
      }
      results = [];
      for (i = 0, len = a.length; i < len; i++) {
        value = a[i];
        if (indexOf.call(b, value) >= 0) {
          results.push(value);
        }
      }
      return results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, removeNoscriptTags(doc.querySelector('body')), CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  createDocument = function(html) {
    var doc;
    doc = document.documentElement.cloneNode();
    doc.innerHTML = html;
    doc.head = doc.querySelector('head');
    doc.body = doc.querySelector('body');
    return doc;
  };

  ComponentUrl = (function() {
    function ComponentUrl(original1) {
      this.original = original1 != null ? original1 : document.location.href;
      if (this.original.constructor === ComponentUrl) {
        return this.original;
      }
      this._parse();
    }

    ComponentUrl.prototype.withoutHash = function() {
      return this.href.replace(this.hash, '').replace('#', '');
    };

    ComponentUrl.prototype.withoutHashForIE10compatibility = function() {
      return this.withoutHash();
    };

    ComponentUrl.prototype.hasNoHash = function() {
      return this.hash.length === 0;
    };

    ComponentUrl.prototype.crossOrigin = function() {
      return this.origin !== (new ComponentUrl).origin;
    };

    ComponentUrl.prototype._parse = function() {
      var ref;
      (this.link != null ? this.link : this.link = document.createElement('a')).href = this.original;
      ref = this.link, this.href = ref.href, this.protocol = ref.protocol, this.host = ref.host, this.hostname = ref.hostname, this.port = ref.port, this.pathname = ref.pathname, this.search = ref.search, this.hash = ref.hash;
      this.origin = [this.protocol, '//', this.hostname].join('');
      if (this.port.length !== 0) {
        this.origin += ":" + this.port;
      }
      this.relative = [this.pathname, this.search, this.hash].join('');
      return this.absolute = this.href;
    };

    return ComponentUrl;

  })();

  Link = (function(superClass) {
    extend(Link, superClass);

    Link.HTML_EXTENSIONS = ['html'];

    Link.allowExtensions = function() {
      var extension, extensions, i, len;
      extensions = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      for (i = 0, len = extensions.length; i < len; i++) {
        extension = extensions[i];
        Link.HTML_EXTENSIONS.push(extension);
      }
      return Link.HTML_EXTENSIONS;
    };

    function Link(link1) {
      this.link = link1;
      if (this.link.constructor === Link) {
        return this.link;
      }
      this.original = this.link.href;
      this.originalElement = this.link;
      this.link = this.link.cloneNode(false);
      Link.__super__.constructor.apply(this, arguments);
    }

    Link.prototype.shouldIgnore = function() {
      return this.crossOrigin() || this._anchored() || this._nonHtml() || this._optOut() || this._target();
    };

    Link.prototype._anchored = function() {
      return (this.hash.length > 0 || this.href.charAt(this.href.length - 1) === '#') && (this.withoutHash() === (new ComponentUrl).withoutHash());
    };

    Link.prototype._nonHtml = function() {
      return this.pathname.match(/\.[a-z]+$/g) && !this.pathname.match(new RegExp("\\.(?:" + (Link.HTML_EXTENSIONS.join('|')) + ")?$", 'g'));
    };

    Link.prototype._optOut = function() {
      var ignore, link;
      link = this.originalElement;
      while (!(ignore || link === document)) {
        ignore = link.getAttribute('data-no-turbolink') != null;
        link = link.parentNode;
      }
      return ignore;
    };

    Link.prototype._target = function() {
      return this.link.target.length !== 0;
    };

    return Link;

  })(ComponentUrl);

  Click = (function() {
    Click.installHandlerLast = function(event) {
      if (!event.defaultPrevented) {
        document.removeEventListener('click', Click.handle, false);
        return document.addEventListener('click', Click.handle, false);
      }
    };

    Click.handle = function(event) {
      return new Click(event);
    };

    function Click(event1) {
      this.event = event1;
      if (this.event.defaultPrevented) {
        return;
      }
      this._extractLink();
      if (this._validForTurbolinks()) {
        if (!pageChangePrevented(this.link.absolute)) {
          visit(this.link.href);
        }
        this.event.preventDefault();
      }
    }

    Click.prototype._extractLink = function() {
      var link;
      link = this.event.target;
      while (!(!link.parentNode || link.nodeName === 'A')) {
        link = link.parentNode;
      }
      if (link.nodeName === 'A' && link.href.length !== 0) {
        return this.link = new Link(link);
      }
    };

    Click.prototype._validForTurbolinks = function() {
      return (this.link != null) && !(this.link.shouldIgnore() || this._nonStandardClick());
    };

    Click.prototype._nonStandardClick = function() {
      return this.event.which > 1 || this.event.metaKey || this.event.ctrlKey || this.event.shiftKey || this.event.altKey;
    };

    return Click;

  })();

  ProgressBar = (function() {
    var className;

    className = 'turbolinks-progress-bar';

    function ProgressBar(elementSelector) {
      this.elementSelector = elementSelector;
      this._trickle = bind(this._trickle, this);
      this.value = 0;
      this.content = '';
      this.speed = 300;
      this.opacity = 0.99;
      this.install();
    }

    ProgressBar.prototype.install = function() {
      this.element = document.querySelector(this.elementSelector);
      this.element.classList.add(className);
      this.styleElement = document.createElement('style');
      document.head.appendChild(this.styleElement);
      return this._updateStyle();
    };

    ProgressBar.prototype.uninstall = function() {
      this.element.classList.remove(className);
      return document.head.removeChild(this.styleElement);
    };

    ProgressBar.prototype.start = function() {
      return this.advanceTo(5);
    };

    ProgressBar.prototype.advanceTo = function(value) {
      var ref;
      if ((value > (ref = this.value) && ref <= 100)) {
        this.value = value;
        this._updateStyle();
        if (this.value === 100) {
          return this._stopTrickle();
        } else if (this.value > 0) {
          return this._startTrickle();
        }
      }
    };

    ProgressBar.prototype.done = function() {
      if (this.value > 0) {
        this.advanceTo(100);
        return this._reset();
      }
    };

    ProgressBar.prototype._reset = function() {
      var originalOpacity;
      originalOpacity = this.opacity;
      setTimeout((function(_this) {
        return function() {
          _this.opacity = 0;
          return _this._updateStyle();
        };
      })(this), this.speed / 2);
      return setTimeout((function(_this) {
        return function() {
          _this.value = 0;
          _this.opacity = originalOpacity;
          return _this._withSpeed(0, function() {
            return _this._updateStyle(true);
          });
        };
      })(this), this.speed);
    };

    ProgressBar.prototype._startTrickle = function() {
      if (this.trickling) {
        return;
      }
      this.trickling = true;
      return setTimeout(this._trickle, this.speed);
    };

    ProgressBar.prototype._stopTrickle = function() {
      return delete this.trickling;
    };

    ProgressBar.prototype._trickle = function() {
      if (!this.trickling) {
        return;
      }
      this.advanceTo(this.value + Math.random() / 2);
      return setTimeout(this._trickle, this.speed);
    };

    ProgressBar.prototype._withSpeed = function(speed, fn) {
      var originalSpeed, result;
      originalSpeed = this.speed;
      this.speed = speed;
      result = fn();
      this.speed = originalSpeed;
      return result;
    };

    ProgressBar.prototype._updateStyle = function(forceRepaint) {
      if (forceRepaint == null) {
        forceRepaint = false;
      }
      if (forceRepaint) {
        this._changeContentToForceRepaint();
      }
      return this.styleElement.textContent = this._createCSSRule();
    };

    ProgressBar.prototype._changeContentToForceRepaint = function() {
      return this.content = this.content === '' ? ' ' : '';
    };

    ProgressBar.prototype._createCSSRule = function() {
      return this.elementSelector + "." + className + "::before {\n  content: '" + this.content + "';\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 2000;\n  background-color: #0076ff;\n  height: 3px;\n  opacity: " + this.opacity + ";\n  width: " + this.value + "%;\n  transition: width " + this.speed + "ms ease-out, opacity " + (this.speed / 2) + "ms ease-in;\n  transform: translate3d(0,0,0);\n}";
    };

    return ProgressBar;

  })();

  bypassOnLoadPopstate = function(fn) {
    return setTimeout(fn, 500);
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent(EVENTS.CHANGE);
      return triggerEvent(EVENTS.UPDATE);
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent(EVENTS.UPDATE);
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, ref;
    if ((ref = event.state) != null ? ref.turbolinks : void 0) {
      if (cachedPage = pageCache[(new ComponentUrl(event.state.url)).absolute]) {
        cacheCurrentPage();
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    document.addEventListener('click', Click.installHandlerLast, true);
    window.addEventListener('hashchange', function(event) {
      rememberCurrentUrl();
      return rememberCurrentState();
    }, false);
    return bypassOnLoadPopstate(function() {
      return window.addEventListener('popstate', installHistoryChangeHandler, false);
    });
  };

  historyStateIsDefined = window.history.state !== void 0 || navigator.userAgent.match(/Firefox\/2[6|7]/);

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && historyStateIsDefined;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (ref = popCookie('request_method')) === 'GET' || ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  browserSupportsCustomEvents = document.addEventListener && document.createEvent;

  if (browserSupportsCustomEvents) {
    installDocumentReadyPageEventTriggers();
    installJqueryAjaxSuccessPageUpdateTrigger();
  }

  if (browserSupportsTurbolinks) {
    visit = fetch;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    enableTransitionCache: enableTransitionCache,
    enableProgressBar: enableProgressBar,
    allowLinkExtensions: Link.allowExtensions,
    supported: browserSupportsTurbolinks,
    EVENTS: clone(EVENTS)
  };

}).call(this);
/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.5",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.5",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),a(c.target).is('input[type="radio"]')||a(c.target).is('input[type="checkbox"]')||c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.5",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.5",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger("hidden.bs.dropdown",f))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.5",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger("shown.bs.dropdown",h)}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.5",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.5",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),c.isInStateTrue()?void 0:(clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide())},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.5",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.5",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),
d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.5",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.5",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
(function() {


}).call(this);
// This file is autogenerated via the `commonjs` Grunt task. You can require() this file in a CommonJS environment.
require('../../js/transition.js')
require('../../js/alert.js')
require('../../js/button.js')
require('../../js/carousel.js')
require('../../js/collapse.js')
require('../../js/dropdown.js')
require('../../js/modal.js')
require('../../js/tooltip.js')
require('../../js/popover.js')
require('../../js/scrollspy.js')
require('../../js/tab.js')
require('../../js/affix.js')
;
/*
 Highcharts 4.1.9 JS v/Highstock 2.1.9 (2015-10-07)

 (c) 2009-2014 Torstein Honsi

 License: www.highcharts.com/license
 Highcharts 4.1.9 JS v/Highstock 2.1.9 (2015-10-07)
 Exporting module

 (c) 2010-2014 Torstein Honsi

 License: www.highcharts.com/license
 Highcharts 4.1.9 JS v/Highstock 2.1.9 (2015-10-07)
 Data module

 (c) 2012-2014 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(){function x(){var a,b=arguments,c,d={},e=function(a,b){var c,d;"object"!==typeof a&&(a={});for(d in b)b.hasOwnProperty(d)&&((c=b[d])&&"object"===typeof c&&"[object Array]"!==Object.prototype.toString.call(c)&&"renderTo"!==d&&"number"!==typeof c.nodeType?a[d]=e(a[d]||{},c):a[d]=b[d]);return a};!0===b[0]&&(d=b[1],b=Array.prototype.slice.call(b,2));c=b.length;for(a=0;a<c;a++)d=e(d,b[a]);return d}function J(a,b){return parseInt(a,b||10)}function ja(a){return"string"===typeof a}function ga(a){return a&&
"object"===typeof a}function aa(a){return"[object Array]"===Object.prototype.toString.call(a)}function V(a){return"number"===typeof a}function oa(a){return na.log(a)/na.LN10}function m(a){return na.pow(10,a)}function q(a,b){for(var c=a.length;c--;)if(a[c]===b){a.splice(c,1);break}}function t(a){return a!==E&&null!==a}function N(a,b,c){var d,e;if(ja(b))t(c)?a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(t(b)&&ga(b))for(d in b)a.setAttribute(d,b[d]);return e}function B(a){return aa(a)?
a:[a]}function A(a,b){ya&&!ra&&b&&b.opacity!==E&&(b.filter="alpha(opacity="+100*b.opacity+")");M(a.style,b)}function F(a,b,c,d,e){a=P.createElement(a);b&&M(a,b);e&&A(a,{padding:0,border:"none",margin:0});c&&A(a,c);d&&d.appendChild(a);return a}function Q(a,b){var c=function(){return E};c.prototype=new a;M(c.prototype,b);return c}function L(a,b){return Array((b||2)+1-String(a).length).join(0)+a}function ua(a,b){return/%$/.test(a)?b*parseFloat(a)/100:parseFloat(a)}function T(a){return 6E4*(Ta&&Ta(a)||
gb||0)}function G(a,b){for(var c="{",d=!1,e,f,g,h,k,n=[];-1!==(c=a.indexOf(c));){e=a.slice(0,c);if(d){f=e.split(":");g=f.shift().split(".");k=g.length;e=b;for(h=0;h<k;h++)e=e[g[h]];f.length&&(f=f.join(":"),g=/\.([0-9])/,h=ka.lang,k=void 0,/f$/.test(f)?(k=(k=f.match(g))?k[1]:-1,null!==e&&(e=X.numberFormat(e,k,h.decimalPoint,-1<f.indexOf(",")?h.thousandsSep:""))):e=Ea(f,e))}n.push(e);a=a.slice(c+1);c=(d=!d)?"}":"{"}n.push(a);return n.join("")}function r(a,b,c,d,e){var f,g=a;c=z(c,1);f=a/c;b||(b=[1,
2,2.5,5,10],!1===d&&(1===c?b=[1,2,5,10]:.1>=c&&(b=[1/c])));for(d=0;d<b.length&&!(g=b[d],e&&g*c>=a||!e&&f<=(b[d]+(b[d+1]||b[d]))/2);d++);return g*c}function l(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].ss_i=e;a.sort(function(a,c){d=b(a,c);return 0===d?a.ss_i-c.ss_i:d});for(e=0;e<c;e++)delete a[e].ss_i}function K(a){for(var b=a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function D(a){for(var b=a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function ha(a,b){for(var c in a)a[c]&&a[c]!==b&&a[c].destroy&&
a[c].destroy(),delete a[c]}function fa(a){Ua||(Ua=F("div"));a&&Ua.appendChild(a);Ua.innerHTML=""}function ba(a,b){var c="Highcharts error #"+a+": www.highcharts.com/errors/"+a;if(b)throw c;la.console&&console.log(c)}function C(a,b){return parseFloat(a.toPrecision(b||14))}function Ja(a,b){b.renderer.globalAnimation=z(a,b.animation)}function rb(){var a=ka.global,b=a.useUTC,c=b?"getUTC":"get",d=b?"setUTC":"set";za=a.Date||window.Date;gb=b&&a.timezoneOffset;Ta=b&&a.getTimezoneOffset;Va=function(a,c,d,
h,k,n){var p;b?(p=za.UTC.apply(0,arguments),p+=T(p)):p=(new za(a,c,z(d,1),z(h,0),z(k,0),z(n,0))).getTime();return p};hb=c+"Minutes";ib=c+"Hours";jb=c+"Day";Ka=c+"Date";La=c+"Month";Ma=c+"FullYear";sb=d+"Milliseconds";tb=d+"Seconds";ub=d+"Minutes";vb=d+"Hours";kb=d+"Date";lb=d+"Month";mb=d+"FullYear"}function S(){}function Fa(a,b,c,d){this.axis=a;this.pos=b;this.type=c||"";this.isNew=!0;c||d||this.addLabel()}function wb(a,b,c,d,e){var f=a.chart.inverted;this.axis=a;this.isNegative=c;this.options=b;
this.x=d;this.total=null;this.points={};this.stack=e;this.alignOptions={align:b.align||(f?c?"left":"right":"center"),verticalAlign:b.verticalAlign||(f?"middle":c?"bottom":"top"),y:z(b.y,f?4:c?14:-6),x:z(b.x,f?c?-6:6:0)};this.textAlign=b.textAlign||(f?c?"right":"left":"center")}var E,P=document,la=window,na=Math,O=na.round,Y=na.floor,xa=na.ceil,H=na.max,U=na.min,ca=na.abs,Da=na.cos,Ga=na.sin,xb=na.PI,Ha=2*xb/360,Ca=navigator.userAgent,Fb=la.opera,ya=/(msie|trident|edge)/i.test(Ca)&&!Fb,yb=!ya&&/AppleWebKit/.test(Ca),
Na=/Firefox/.test(Ca),zb=/(Mobile|Android|Windows Phone)/.test(Ca),ra=!!P.createElementNS&&!!P.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,Gb=Na&&4>parseInt(Ca.split("Firefox/")[1],10),va=!ra&&!ya&&!!P.createElement("canvas").getContext,Oa,Ab={},nb=0,Ua,ka,Ea,ob,Z,sa=function(){return E},pa=[],Pa=0,Hb=/^[0-9]+$/,Wa=["plotTop","marginRight","marginBottom","plotLeft"],za,Va,gb,Ta,hb,ib,jb,Ka,La,Ma,sb,tb,ub,vb,kb,lb,mb,W={},X;X=la.Highcharts=la.Highcharts?ba(16,!0):{};X.seriesTypes=
W;var M=X.extend=function(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a},z=X.pick=function(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],c!==E&&null!==c)return c},Bb=X.wrap=function(a,b,c){var d=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments);a.unshift(d);return c.apply(this,a)}};Ea=function(a,b,c){if(!t(b)||isNaN(b))return ka.lang.invalidDate||"";a=z(a,"%Y-%m-%d %H:%M:%S");var d=new za(b-T(b)),e,f=d[ib](),g=d[jb](),h=d[Ka](),k=d[La](),n=d[Ma](),p=ka.lang,y=p.weekdays,
d=M({a:y[g].substr(0,3),A:y[g],d:L(h),e:h,w:g,b:p.shortMonths[k],B:p.months[k],m:L(k+1),y:n.toString().substr(2,2),Y:n,H:L(f),k:f,I:L(f%12||12),l:f%12||12,M:L(d[hb]()),p:12>f?"AM":"PM",P:12>f?"am":"pm",S:L(d.getSeconds()),L:L(O(b%1E3),3)},X.dateFormats);for(e in d)for(;-1!==a.indexOf("%"+e);)a=a.replace("%"+e,"function"===typeof d[e]?d[e](b):d[e]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};Z={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5,month:24192E5,year:314496E5};
X.numberFormat=function(a,b,c,d){var e=ka.lang;a=+a||0;var f=-1===b?U((a.toString().split(".")[1]||"").length,20):isNaN(b=ca(b))?2:b;b=void 0===c?e.decimalPoint:c;d=void 0===d?e.thousandsSep:d;e=0>a?"-":"";c=String(J(a=ca(a).toFixed(f)));var g=3<c.length?c.length%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+ca(a-c).toFixed(f).slice(2):"")};ob={init:function(a,b,c){b=b||"";var d=a.shift,e=-1<b.indexOf("C"),f=e?7:3,g;b=b.split(" ");c=[].concat(c);var h,k,n=function(a){for(g=
a.length;g--;)"M"===a[g]&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};e&&(n(b),n(c));a.isArea&&(h=b.splice(b.length-6,6),k=c.splice(c.length-6,6));if(d<=c.length/f&&b.length===c.length)for(;d--;)c=[].concat(c).splice(0,f).concat(c);a.shift=0;if(b.length)for(a=c.length;b.length<a;)d=[].concat(b).splice(b.length-f,f),e&&(d[f-6]=d[f-2],d[f-5]=d[f-1]),b=b.concat(d);h&&(b=b.concat(h),c=c.concat(k));return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(1===c)e=d;else if(f===b.length&&1>c)for(;f--;)d=
parseFloat(a[f]),e[f]=isNaN(d)?a[f]:c*parseFloat(b[f]-d)+d;else e=b;return e}};(function(a){la.HighchartsAdapter=la.HighchartsAdapter||a&&{init:function(b){var c=a.fx;a.extend(a.easing,{easeOutQuad:function(a,b,c,g,h){return-g*(b/=h)*(b-2)+c}});a.each(["cur","_default","width","height","opacity"],function(b,e){var f=c.step,g;"cur"===e?f=c.prototype:"_default"===e&&a.Tween&&(f=a.Tween.propHooks[e],e="set");(g=f[e])&&(f[e]=function(a){var c;a=b?a:this;if("align"!==a.prop)return c=a.elem,c.attr?c.attr(a.prop,
"cur"===e?E:a.now):g.apply(this,arguments)})});Bb(a.cssHooks.opacity,"get",function(a,b,c){return b.attr?b.opacity||0:a.call(this,b,c)});this.addAnimSetter("d",function(a){var c=a.elem,f;a.started||(f=b.init(c,c.d,c.toD),a.start=f[0],a.end=f[1],a.started=!0);c.attr("d",b.step(a.start,a.end,a.pos,c.toD))});this.each=Array.prototype.forEach?function(a,b){return Array.prototype.forEach.call(a,b)}:function(a,b){var c,g=a.length;for(c=0;c<g;c++)if(!1===b.call(a[c],a[c],c,a))return c};a.fn.highcharts=function(){var a=
"Chart",b=arguments,c,g;this[0]&&(ja(b[0])&&(a=b[0],b=Array.prototype.slice.call(b,1)),c=b[0],c!==E&&(c.chart=c.chart||{},c.chart.renderTo=this[0],new X[a](c,b[1]),g=this),c===E&&(g=pa[N(this[0],"data-highcharts-chart")]));return g}},addAnimSetter:function(b,c){a.Tween?a.Tween.propHooks[b]={set:c}:a.fx.step[b]=c},getScript:a.getScript,inArray:a.inArray,adapterRun:function(b,c){return a(b)[c]()},grep:a.grep,map:function(a,c){for(var d=[],e=0,f=a.length;e<f;e++)d[e]=c.call(a[e],a[e],e,a);return d},
offset:function(b){return a(b).offset()},addEvent:function(b,c,d){a(b).bind(c,d)},removeEvent:function(b,c,d){var e=P.removeEventListener?"removeEventListener":"detachEvent";P[e]&&b&&!b[e]&&(b[e]=function(){});a(b).unbind(c,d)},fireEvent:function(b,c,d,e){var f=a.Event(c),g="detached"+c,h;!ya&&d&&(delete d.layerX,delete d.layerY,delete d.returnValue);M(f,d);b[c]&&(b[g]=b[c],b[c]=null);a.each(["preventDefault","stopPropagation"],function(a,b){var c=f[b];f[b]=function(){try{c.call(f)}catch(a){"preventDefault"===
b&&(h=!0)}}});a(b).trigger(f);b[g]&&(b[c]=b[g],b[g]=null);!e||f.isDefaultPrevented()||h||e(f)},washMouseEvent:function(a){var c=a.originalEvent||a;c.pageX===E&&(c.pageX=a.pageX,c.pageY=a.pageY);return c},animate:function(b,c,d){var e=a(b);b.style||(b.style={});c.d&&(b.toD=c.d,c.d=1);e.stop();c.opacity!==E&&b.attr&&(c.opacity+="px");b.hasAnim=1;e.animate(c,d)},stop:function(b){b.hasAnim&&a(b).stop()}}})(la.jQuery);var Xa=la.HighchartsAdapter,ta=Xa||{};Xa&&Xa.init.call(Xa,ob);var Ya=ta.adapterRun,Qa=
ta.inArray,v=X.each=ta.each,Za=ta.grep,Ib=ta.offset,Ra=ta.map,ia=ta.addEvent,qa=ta.removeEvent,da=ta.fireEvent,Jb=ta.washMouseEvent,$a=ta.animate,Sa=ta.stop;ka={colors:"#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January February March April May June July August September October November December".split(" "),shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),decimalPoint:".",numericSymbols:"kMGTPE".split(""),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{useUTC:!0,canvasToolsURL:"http://code.highcharts.com@product.cdnpath@//Highstock 2.1.9/modules/canvas-tools.js",VMLRadialGradientURL:"http://code.highcharts.com@product.cdnpath@//Highstock 2.1.9/gfx/vml-radial-gradient.png"},chart:{borderColor:"#4572A7",borderRadius:0,defaultSeriesType:"line",
ignoreHiddenSeries:!0,spacing:[10,10,15,10],backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10}}},title:{text:"Chart title",align:"center",margin:15,style:{color:"#333333",fontSize:"18px"}},subtitle:{text:"",align:"center",style:{color:"#555555"}},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,marker:{lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{enabled:!0,lineWidthPlus:1,
radiusPlus:2},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:{align:"center",formatter:function(){return null===this.y?"":X.numberFormat(this.y,-1)},style:{color:"contrast",fontSize:"11px",fontWeight:"bold",textShadow:"0 0 6px contrast, 0 0 3px contrast"},verticalAlign:"bottom",x:0,y:0,padding:5},cropThreshold:300,pointRange:0,softThreshold:!0,states:{hover:{lineWidthPlus:1,marker:{},halo:{size:10,opacity:.25}},select:{marker:{}}},stickyTracking:!0,turboThreshold:1E3}},
labels:{style:{position:"absolute",color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#909090",borderRadius:0,navigation:{activeColor:"#274b6d",inactiveColor:"#CCC"},shadow:!1,itemStyle:{color:"#333333",fontSize:"12px",fontWeight:"bold"},itemHoverStyle:{color:"#000"},itemHiddenStyle:{color:"#CCC"},itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},
loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:"white",opacity:.5,textAlign:"center"}},tooltip:{enabled:!0,animation:ra,backgroundColor:"rgba(249, 249, 249, .85)",borderWidth:1,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},footerFormat:"",headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',
pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',shadow:!0,snap:zb?25:10,style:{color:"#333333",cursor:"default",fontSize:"12px",padding:"8px",pointerEvents:"none",whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#909090",fontSize:"9px"}}};var ma=ka.plotOptions,Cb=ma.line;rb();var Kb=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
Lb=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,Mb=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,Aa=function(a){var b=[],c,d;(function(a){a&&a.stops?d=Ra(a.stops,function(a){return Aa(a[1])}):(c=Kb.exec(a))?b=[J(c[1]),J(c[2]),J(c[3]),parseFloat(c[4],10)]:(c=Lb.exec(a))?b=[J(c[1],16),J(c[2],16),J(c[3],16),1]:(c=Mb.exec(a))&&(b=[J(c[1]),J(c[2]),J(c[3]),1])})(a);return{get:function(c){var f;d?(f=x(a),f.stops=[].concat(f.stops),v(d,function(a,b){f.stops[b]=[f.stops[b][0],a.get(c)]})):
f=b&&!isNaN(b[0])?"rgb"===c?"rgb("+b[0]+","+b[1]+","+b[2]+")":"a"===c?b[3]:"rgba("+b.join(",")+")":a;return f},brighten:function(a){if(d)v(d,function(b){b.brighten(a)});else if(V(a)&&0!==a){var c;for(c=0;3>c;c++)b[c]+=J(255*a),0>b[c]&&(b[c]=0),255<b[c]&&(b[c]=255)}return this},rgba:b,setOpacity:function(a){b[3]=a;return this},raw:a}};S.prototype={opacity:1,textProps:"fontSize fontWeight fontFamily fontStyle color lineHeight width textDecoration textOverflow textShadow".split(" "),init:function(a,
b){this.element="span"===b?F(b):P.createElementNS("http://www.w3.org/2000/svg",b);this.renderer=a},animate:function(a,b,c){b=z(b,this.renderer.globalAnimation,!0);Sa(this);b?(b=x(b,{}),c&&(b.complete=c),$a(this,a,b)):this.attr(a,null,c);return this},colorGradient:function(a,b,c){var d=this.renderer,e,f,g,h,k,n,p,y,w,u,R,I=[];a.linearGradient?f="linearGradient":a.radialGradient&&(f="radialGradient");if(f){g=a[f];k=d.gradients;p=a.stops;u=c.radialReference;aa(g)&&(a[f]=g={x1:g[0],y1:g[1],x2:g[2],y2:g[3],
gradientUnits:"userSpaceOnUse"});"radialGradient"===f&&u&&!t(g.gradientUnits)&&(h=g,g=x(g,d.getRadialAttr(u,h),{gradientUnits:"userSpaceOnUse"}));for(R in g)"id"!==R&&I.push(R,g[R]);for(R in p)I.push(p[R]);I=I.join(",");k[I]?a=k[I].attr("id"):(g.id=a="highcharts-"+nb++,k[I]=n=d.createElement(f).attr(g).add(d.defs),n.radAttr=h,n.stops=[],v(p,function(a){0===a[1].indexOf("rgba")?(e=Aa(a[1]),y=e.get("rgb"),w=e.get("a")):(y=a[1],w=1);a=d.createElement("stop").attr({offset:a[0],"stop-color":y,"stop-opacity":w}).add(n);
n.stops.push(a)}));c.setAttribute(b,"url("+d.url+"#"+a+")");c.gradient=I}},applyTextShadow:function(a){var b=this.element,c,d=-1!==a.indexOf("contrast"),e={},f=this.renderer.forExport,g=f||b.style.textShadow!==E&&!ya;d&&(e.textShadow=a=a.replace(/contrast/g,this.renderer.getContrast(b.style.fill)));if(yb||f)e.textRendering="geometricPrecision";g?this.css(e):(this.fakeTS=!0,this.ySetter=this.xSetter,c=[].slice.call(b.getElementsByTagName("tspan")),v(a.split(/\s?,\s?/g),function(a){var d=b.firstChild,
e,f;a=a.split(" ");e=a[a.length-1];(f=a[a.length-2])&&v(c,function(a,c){var g;0===c&&(a.setAttribute("x",b.getAttribute("x")),c=b.getAttribute("y"),a.setAttribute("y",c||0),null===c&&b.setAttribute("y",0));g=a.cloneNode(1);N(g,{"class":"highcharts-text-shadow",fill:e,stroke:e,"stroke-opacity":1/H(J(f),3),"stroke-width":f,"stroke-linejoin":"round"});b.insertBefore(g,d)})}))},attr:function(a,b,c){var d,e=this.element,f,g=this,h;"string"===typeof a&&b!==E&&(d=a,a={},a[d]=b);if("string"===typeof a)g=
(this[a+"Getter"]||this._defaultGetter).call(this,a,e);else{for(d in a)b=a[d],h=!1,this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(d)&&(f||(this.symbolAttr(a),f=!0),h=!0),!this.rotation||"x"!==d&&"y"!==d||(this.doTransform=!0),h||(this[d+"Setter"]||this._defaultSetter).call(this,b,d,e),this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(d)&&this.updateShadows(d,b);this.doTransform&&(this.updateTransform(),this.doTransform=!1)}c&&c();return g},updateShadows:function(a,
b){for(var c=this.shadows,d=c.length;d--;)c[d].setAttribute(a,"height"===a?H(b-(c[d].cutHeight||0),0):"d"===a?this.d:b)},addClass:function(a){var b=this.element,c=N(b,"class")||"";-1===c.indexOf(a)&&N(b,"class",c+" "+a);return this},symbolAttr:function(a){var b=this;v("x y r start end width height innerR anchorX anchorY".split(" "),function(c){b[c]=z(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+
"#"+a.id+")":"none")},crisp:function(a){var b,c={},d,e=a.strokeWidth||this.strokeWidth||0;d=O(e)%2/2;a.x=Y(a.x||this.x||0)+d;a.y=Y(a.y||this.y||0)+d;a.width=Y((a.width||this.width||0)-2*d);a.height=Y((a.height||this.height||0)-2*d);a.strokeWidth=e;for(b in a)this[b]!==a[b]&&(this[b]=c[b]=a[b]);return c},css:function(a){var b=this.styles,c={},d=this.element,e,f,g="";e=!b;a&&a.color&&(a.fill=a.color);if(b)for(f in a)a[f]!==b[f]&&(c[f]=a[f],e=!0);if(e){e=this.textWidth=a&&a.width&&"text"===d.nodeName.toLowerCase()&&
J(a.width)||this.textWidth;b&&(a=M(b,c));this.styles=a;e&&(va||!ra&&this.renderer.forExport)&&delete a.width;if(ya&&!ra)A(this.element,a);else{b=function(a,b){return"-"+b.toLowerCase()};for(f in a)g+=f.replace(/([A-Z])/g,b)+":"+a[f]+";";N(d,"style",g)}e&&this.added&&this.renderer.buildText(this)}return this},on:function(a,b){var c=this,d=c.element;Oa&&"click"===a?(d.ontouchstart=function(a){c.touchEventFired=za.now();a.preventDefault();b.call(d,a)},d.onclick=function(a){(-1===Ca.indexOf("Android")||
1100<za.now()-(c.touchEventFired||0))&&b.call(d,a)}):d["on"+a]=b;return this},setRadialReference:function(a){var b=this.renderer.gradients[this.element.gradient];this.element.radialReference=a;b&&b.radAttr&&b.animate(this.renderer.getRadialAttr(a,b.radAttr));return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=!0;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.scaleX,
d=this.scaleY,e=this.inverted,f=this.rotation,g=this.element;e&&(a+=this.attr("width"),b+=this.attr("height"));a=["translate("+a+","+b+")"];e?a.push("rotate(90) scale(-1,1)"):f&&a.push("rotate("+f+" "+(g.getAttribute("x")||0)+" "+(g.getAttribute("y")||0)+")");(t(c)||t(d))&&a.push("scale("+z(c,1)+" "+z(d,1)+")");a.length&&g.setAttribute("transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){var d,e,f,g,h={};e=this.renderer;f=e.alignedObjects;
if(a){if(this.alignOptions=a,this.alignByTranslate=b,!c||ja(c))this.alignTo=d=c||"renderer",q(f,this),f.push(this),c=null}else a=this.alignOptions,b=this.alignByTranslate,d=this.alignTo;c=z(c,e[d],e);d=a.align;e=a.verticalAlign;f=(c.x||0)+(a.x||0);g=(c.y||0)+(a.y||0);if("right"===d||"center"===d)f+=(c.width-(a.width||0))/{right:1,center:2}[d];h[b?"translateX":"x"]=O(f);if("bottom"===e||"middle"===e)g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1);h[b?"translateY":"y"]=O(g);this[this.placed?
"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(a){var b,c=this.renderer,d,e=this.rotation,f=this.element,g=this.styles,h=e*Ha;d=this.textStr;var k,n=f.style,p,y;d!==E&&(y=["",e||0,g&&g.fontSize,f.style.width].join(),y=""===d||Hb.test(d)?"num:"+d.toString().length+y:d+y);y&&!a&&(b=c.cache[y]);if(!b){if("http://www.w3.org/2000/svg"===f.namespaceURI||c.forExport){try{p=this.fakeTS&&function(a){v(f.querySelectorAll(".highcharts-text-shadow"),function(b){b.style.display=
a})},Na&&n.textShadow?(k=n.textShadow,n.textShadow=""):p&&p("none"),b=f.getBBox?M({},f.getBBox()):{width:f.offsetWidth,height:f.offsetHeight},k?n.textShadow=k:p&&p("")}catch(w){}if(!b||0>b.width)b={width:0,height:0}}else b=this.htmlGetBBox();c.isSVG&&(a=b.width,d=b.height,ya&&g&&"11px"===g.fontSize&&"16.9"===d.toPrecision(3)&&(b.height=d=14),e&&(b.width=ca(d*Ga(h))+ca(a*Da(h)),b.height=ca(d*Da(h))+ca(a*Ga(h))));y&&(c.cache[y]=b)}return b},show:function(a){return this.attr({visibility:a?"inherit":
"visible"})},hide:function(){return this.attr({visibility:"hidden"})},fadeOut:function(a){var b=this;b.animate({opacity:0},{duration:a||150,complete:function(){b.attr({y:-9999})}})},add:function(a){var b=this.renderer,c=this.element,d;a&&(this.parentGroup=a);this.parentInverted=a&&a.inverted;void 0!==this.textStr&&b.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)d=this.zIndexSetter();d||(a?a.element:b.box).appendChild(c);if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var b=
a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},c=a.shadows,d=a.renderer.isSVG&&"SPAN"===b.nodeName&&a.parentGroup,e,f;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=b.point=null;Sa(a);a.clipPath&&(a.clipPath=a.clipPath.destroy());if(a.stops){for(f=0;f<a.stops.length;f++)a.stops[f]=a.stops[f].destroy();a.stops=null}a.safeRemoveChild(b);for(c&&v(c,function(b){a.safeRemoveChild(b)});d&&d.div&&0===d.div.childNodes.length;)b=d.parentGroup,a.safeRemoveChild(d.div),delete d.div,
d=b;a.alignTo&&q(a.renderer.alignedObjects,a);for(e in a)delete a[e];return null},shadow:function(a,b,c){var d=[],e,f,g=this.element,h,k,n,p;if(a){k=z(a.width,3);n=(a.opacity||.15)/k;p=this.parentInverted?"(-1,-1)":"("+z(a.offsetX,1)+", "+z(a.offsetY,1)+")";for(e=1;e<=k;e++)f=g.cloneNode(0),h=2*k+1-2*e,N(f,{isShadow:"true",stroke:a.color||"black","stroke-opacity":n*e,"stroke-width":h,transform:"translate"+p,fill:"none"}),c&&(N(f,"height",H(N(f,"height")-h,0)),f.cutHeight=h),b?b.element.appendChild(f):
g.parentNode.insertBefore(f,g),d.push(f);this.shadows=d}return this},xGetter:function(a){"circle"===this.element.nodeName&&(a={x:"cx",y:"cy"}[a]||a);return this._defaultGetter(a)},_defaultGetter:function(a){a=z(this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},dSetter:function(a,b,c){a&&a.join&&(a=a.join(" "));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");c.setAttribute(b,a);this[b]=a},dashstyleSetter:function(a){var b;if(a=a&&a.toLowerCase()){a=
a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(b=a.length;b--;)a[b]=J(a[b])*this["stroke-width"];a=a.join(",").replace("NaN","none");this.element.setAttribute("stroke-dasharray",a)}},alignSetter:function(a){this.element.setAttribute("text-anchor",{left:"start",center:"middle",right:"end"}[a])},opacitySetter:function(a,
b,c){this[b]=a;c.setAttribute(b,a)},titleSetter:function(a){var b=this.element.getElementsByTagName("title")[0];b||(b=P.createElementNS("http://www.w3.org/2000/svg","title"),this.element.appendChild(b));b.appendChild(P.createTextNode(String(z(a),"").replace(/<[^>]*>/g,"")))},textSetter:function(a){a!==this.textStr&&(delete this.bBox,this.textStr=a,this.added&&this.renderer.buildText(this))},fillSetter:function(a,b,c){"string"===typeof a?c.setAttribute(b,a):a&&this.colorGradient(a,b,c)},visibilitySetter:function(a,
b,c){"inherit"===a?c.removeAttribute(b):c.setAttribute(b,a)},zIndexSetter:function(a,b){var c=this.renderer,d=this.parentGroup,c=(d||c).element||c.box,e,f,g=this.element,h;e=this.added;var k;t(a)&&(g.setAttribute(b,a),a=+a,this[b]===a&&(e=!1),this[b]=a);if(e){(a=this.zIndex)&&d&&(d.handleZ=!0);d=c.childNodes;for(k=0;k<d.length&&!h;k++)e=d[k],f=N(e,"zIndex"),e!==g&&(J(f)>a||!t(a)&&t(f))&&(c.insertBefore(g,e),h=!0);h||c.appendChild(g)}return h},_defaultSetter:function(a,b,c){c.setAttribute(b,a)}};S.prototype.yGetter=
S.prototype.xGetter;S.prototype.translateXSetter=S.prototype.translateYSetter=S.prototype.rotationSetter=S.prototype.verticalAlignSetter=S.prototype.scaleXSetter=S.prototype.scaleYSetter=function(a,b){this[b]=a;this.doTransform=!0};S.prototype["stroke-widthSetter"]=S.prototype.strokeSetter=function(a,b,c){this[b]=a;this.stroke&&this["stroke-width"]?(this.strokeWidth=this["stroke-width"],S.prototype.fillSetter.call(this,this.stroke,"stroke",c),c.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=
!0):"stroke-width"===b&&0===a&&this.hasStroke&&(c.removeAttribute("stroke"),this.hasStroke=!1)};var bb=function(){this.init.apply(this,arguments)};bb.prototype={Element:S,init:function(a,b,c,d,e,f){var g=location,h;d=this.createElement("svg").attr({version:"1.1"}).css(this.getStyle(d));h=d.element;a.appendChild(h);-1===a.innerHTML.indexOf("xmlns")&&N(h,"xmlns","http://www.w3.org/2000/svg");this.isSVG=!0;this.box=h;this.boxWrapper=d;this.alignedObjects=[];this.url=(Na||yb)&&P.getElementsByTagName("base").length?
g.href.replace(/#.*?$/,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(P.createTextNode("Created with Highcharts 4.1.9 /Highstock 2.1.9"));this.defs=this.createElement("defs").add();this.allowHTML=f;this.forExport=e;this.gradients={};this.cache={};this.setSize(b,c,!1);var k;Na&&a.getBoundingClientRect&&(this.subPixelFix=b=function(){A(a,{left:0,top:0});k=a.getBoundingClientRect();A(a,{left:xa(k.left)-k.left+"px",top:xa(k.top)-k.top+"px"})},
b(),ia(la,"resize",b))},getStyle:function(a){return this.style=M({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},isHidden:function(){return!this.boxWrapper.getBBox().width},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();ha(this.gradients||{});this.gradients=null;a&&(this.defs=a.destroy());this.subPixelFix&&qa(la,"resize",this.subPixelFix);return this.alignedObjects=null},createElement:function(a){var b=
new this.Element;b.init(this,a);return b},draw:function(){},getRadialAttr:function(a,b){return{cx:a[0]-a[2]/2+b.cx*a[2],cy:a[1]-a[2]/2+b.cy*a[2],r:b.r*a[2]}},buildText:function(a){for(var b=a.element,c=this,d=c.forExport,e=z(a.textStr,"").toString(),f=-1!==e.indexOf("<"),g=b.childNodes,h,k,n=N(b,"x"),p=a.styles,y=a.textWidth,w=p&&p.lineHeight,u=p&&p.textShadow,R=p&&"ellipsis"===p.textOverflow,I=g.length,l=y&&!a.added&&this.box,r=function(a){return w?J(w):c.fontMetrics(/(px|em)$/.test(a&&a.style.fontSize)?
a.style.fontSize:p&&p.fontSize||c.style.fontSize||12,a).h},t=function(a){return a.replace(/&lt;/g,"<").replace(/&gt;/g,">")};I--;)b.removeChild(g[I]);f||u||R||-1!==e.indexOf(" ")?(h=/<.*style="([^"]+)".*>/,k=/<.*href="(http[^"]+)".*>/,l&&l.appendChild(b),e=f?e.replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br.*?>/g):[e],""===e[e.length-1]&&e.pop(),v(e,function(e,
f){var g,u=0;e=e.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");g=e.split("|||");v(g,function(e){if(""!==e||1===g.length){var w={},I=P.createElementNS("http://www.w3.org/2000/svg","tspan"),l;h.test(e)&&(l=e.match(h)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),N(I,"style",l));k.test(e)&&!d&&(N(I,"onclick",'location.href="'+e.match(k)[1]+'"'),A(I,{cursor:"pointer"}));e=t(e.replace(/<(.|\n)*?>/g,"")||" ");if(" "!==e){I.appendChild(P.createTextNode(e));u?w.dx=0:f&&null!==n&&(w.x=n);N(I,
w);b.appendChild(I);!u&&f&&(!ra&&d&&A(I,{display:"block"}),N(I,"dy",r(I)));if(y){for(var w=e.replace(/([^\^])-/g,"$1- ").split(" "),z=1<g.length||f||1<w.length&&"nowrap"!==p.whiteSpace,v,m,q,ab=[],K=r(I),D=1,G=a.rotation,x=e,cb=x.length;(z||R)&&(w.length||ab.length);)a.rotation=0,v=a.getBBox(!0),q=v.width,!ra&&c.forExport&&(q=c.measureSpanWidth(I.firstChild.data,a.styles)),v=q>y,void 0===m&&(m=v),R&&m?(cb/=2,""===x||!v&&.5>cb?w=[]:(v&&(m=!0),x=e.substring(0,x.length+(v?-1:1)*xa(cb)),w=[x+(3<y?"\u2026":
"")],I.removeChild(I.firstChild))):v&&1!==w.length?(I.removeChild(I.firstChild),ab.unshift(w.pop())):(w=ab,ab=[],w.length&&(D++,I=P.createElementNS("http://www.w3.org/2000/svg","tspan"),N(I,{dy:K,x:n}),l&&N(I,"style",l),b.appendChild(I)),q>y&&(y=q)),w.length&&I.appendChild(P.createTextNode(w.join(" ").replace(/- /g,"-")));m&&a.attr("title",a.textStr);a.rotation=G}u++}}})}),l&&l.removeChild(b),u&&a.applyTextShadow&&a.applyTextShadow(u)):b.appendChild(P.createTextNode(t(e)))},getContrast:function(a){a=
Aa(a).rgba;return 384<a[0]+a[1]+a[2]?"#000000":"#FFFFFF"},button:function(a,b,c,d,e,f,g,h,k){var n=this.label(a,b,c,k,null,null,null,null,"button"),p=0,y,w,u,R,I,l;a={x1:0,y1:0,x2:0,y2:1};e=x({"stroke-width":1,stroke:"#CCCCCC",fill:{linearGradient:a,stops:[[0,"#FEFEFE"],[1,"#F6F6F6"]]},r:2,padding:5,style:{color:"black"}},e);u=e.style;delete e.style;f=x(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#FFF"],[1,"#ACF"]]}},f);R=f.style;delete f.style;g=x(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,
"#9BD"],[1,"#CDF"]]}},g);I=g.style;delete g.style;h=x(e,{style:{color:"#CCC"}},h);l=h.style;delete h.style;ia(n.element,ya?"mouseover":"mouseenter",function(){3!==p&&n.attr(f).css(R)});ia(n.element,ya?"mouseout":"mouseleave",function(){3!==p&&(y=[e,f,g][p],w=[u,R,I][p],n.attr(y).css(w))});n.setState=function(a){(n.state=p=a)?2===a?n.attr(g).css(I):3===a&&n.attr(h).css(l):n.attr(e).css(u)};return n.on("click",function(a){3!==p&&d.call(n,a)}).attr(e).css(M({cursor:"default"},u))},crispLine:function(a,
b){a[1]===a[4]&&(a[1]=a[4]=O(a[1])-b%2/2);a[2]===a[5]&&(a[2]=a[5]=O(a[2])+b%2/2);return a},path:function(a){var b={fill:"none"};aa(a)?b.d=a:ga(a)&&M(b,a);return this.createElement("path").attr(b)},circle:function(a,b,c){a=ga(a)?a:{x:a,y:b,r:c};b=this.createElement("circle");b.xSetter=function(a){this.element.setAttribute("cx",a)};b.ySetter=function(a){this.element.setAttribute("cy",a)};return b.attr(a)},arc:function(a,b,c,d,e,f){ga(a)&&(b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x);a=this.symbol("arc",
a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0});a.r=c;return a},rect:function(a,b,c,d,e,f){e=ga(a)?a.r:e;var g=this.createElement("rect");a=ga(a)?a:a===E?{}:{x:a,y:b,width:H(c,0),height:H(d,0)};f!==E&&(a.strokeWidth=f,a=g.crisp(a));e&&(a.r=e);g.rSetter=function(a){N(this.element,{rx:a,ry:a})};return g.attr(a)},setSize:function(a,b,c){var d=this.alignedObjects,e=d.length;this.width=a;this.height=b;for(this.boxWrapper[z(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=
this.createElement("g");return t(a)?b.attr({"class":"highcharts-"+a}):b},image:function(a,b,c,d,e){var f={preserveAspectRatio:"none"};1<arguments.length&&M(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",a);return f},symbol:function(a,b,c,d,e,f){var g,h=this.symbols[a],h=h&&h(O(b),O(c),d,e,f),k=/^url\((.*?)\)$/,n,p;h?(g=this.path(h),M(g,{symbolName:a,
x:b,y:c,width:d,height:e}),f&&M(g,f)):k.test(a)&&(p=function(a,b){a.element&&(a.attr({width:b[0],height:b[1]}),a.alignByTranslate||a.translate(O((d-b[0])/2),O((e-b[1])/2)))},n=a.match(k)[1],a=Ab[n]||f&&f.width&&f.height&&[f.width,f.height],g=this.image(n).attr({x:b,y:c}),g.isImg=!0,a?p(g,a):(g.attr({width:0,height:0}),F("img",{onload:function(){0===this.width&&(A(this,{position:"absolute",top:"-999em"}),document.body.appendChild(this));p(g,Ab[n]=[this.width,this.height]);this.parentNode&&this.parentNode.removeChild(this)},
src:n})));return g},symbols:{circle:function(a,b,c,d){var e=.166*c;return["M",a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c,b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d/2,a+c/2,b+d,a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start;c=e.r||c||d;var g=
e.end-.001;d=e.innerR;var h=e.open,k=Da(f),n=Ga(f),p=Da(g),g=Ga(g);e=e.end-f<xb?0:1;return["M",a+c*k,b+c*n,"A",c,c,0,e,1,a+c*p,b+c*g,h?"M":"L",a+d*p,b+d*g,"A",d,d,0,e,0,a+d*k,b+d*n,h?"":"Z"]},callout:function(a,b,c,d,e){var f=U(e&&e.r||0,c,d),g=f+6,h=e&&e.anchorX;e=e&&e.anchorY;var k;k=["M",a+f,b,"L",a+c-f,b,"C",a+c,b,a+c,b,a+c,b+f,"L",a+c,b+d-f,"C",a+c,b+d,a+c,b+d,a+c-f,b+d,"L",a+f,b+d,"C",a,b+d,a,b+d,a,b+d-f,"L",a,b+f,"C",a,b,a,b,a+f,b];h&&h>c&&e>b+g&&e<b+d-g?k.splice(13,3,"L",a+c,e-6,a+c+6,e,a+
c,e+6,a+c,b+d-f):h&&0>h&&e>b+g&&e<b+d-g?k.splice(33,3,"L",a,e+6,a-6,e,a,e-6,a,b+f):e&&e>d&&h>a+g&&h<a+c-g?k.splice(23,3,"L",h+6,b+d,h,b+d+6,h-6,b+d,a+f,b+d):e&&0>e&&h>a+g&&h<a+c-g&&k.splice(3,3,"L",h-6,b,h,b-6,h+6,b,c-f,b);return k}},clipRect:function(a,b,c,d){var e="highcharts-"+nb++,f=this.createElement("clipPath").attr({id:e}).add(this.defs);a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;a.count=0;return a},text:function(a,b,c,d){var e=va||!ra&&this.forExport,f={};if(d&&(this.allowHTML||!this.forExport))return this.html(a,
b,c);f.x=Math.round(b||0);c&&(f.y=Math.round(c));if(a||0===a)f.text=a;a=this.createElement("text").attr(f);e&&a.css({position:"absolute"});d||(a.xSetter=function(a,b,c){var d=c.getElementsByTagName("tspan"),e,f=c.getAttribute(b),w;for(w=0;w<d.length;w++)e=d[w],e.getAttribute(b)===f&&e.setAttribute(b,a);c.setAttribute(b,a)});return a},fontMetrics:function(a,b){var c,d;a=a||this.style.fontSize;!a&&b&&la.getComputedStyle&&(b=b.element||b,a=(c=la.getComputedStyle(b,""))&&c.fontSize);a=/px/.test(a)?J(a):
/em/.test(a)?12*parseFloat(a):12;c=24>a?a+3:O(1.2*a);d=O(.8*c);return{h:c,b:d,f:a}},rotCorr:function(a,b,c){var d=a;b&&c&&(d=H(d*Da(b*Ha),4));return{x:-a/3*Ga(b*Ha),y:d}},label:function(a,b,c,d,e,f,g,h,k){function n(){var a,b;a=R.element.style;l=(void 0===q||void 0===K||u.styles.textAlign)&&t(R.textStr)&&R.getBBox();u.width=(q||l.width||0)+2*z+m;u.height=(K||l.height||0)+2*z;B=z+w.fontMetrics(a&&a.fontSize,R).b;ha&&(I||(a=O(-r*z)+A,b=(h?-B:0)+A,u.box=I=d?w.symbol(d,a,b,u.width,u.height,N):w.rect(a,
b,u.width,u.height,0,N["stroke-width"]),I.isImg||I.attr("fill","none"),I.add(u)),I.isImg||I.attr(M({width:O(u.width),height:O(u.height)},N)),N=null)}function p(){var a=u.styles,a=a&&a.textAlign,b=m+z*(1-r),c;c=h?0:B;t(q)&&l&&("center"===a||"right"===a)&&(b+={center:.5,right:1}[a]*(q-l.width));if(b!==R.x||c!==R.y)R.attr("x",b),c!==E&&R.attr("y",c);R.x=b;R.y=c}function y(a,b){I?I.attr(a,b):N[a]=b}var w=this,u=w.g(k),R=w.text("",0,0,g).attr({zIndex:1}),I,l,r=0,z=3,m=0,q,K,D,G,A=0,N={},B,ha;u.onAdd=function(){R.add(u);
u.attr({text:a||0===a?a:"",x:b,y:c});I&&t(e)&&u.attr({anchorX:e,anchorY:f})};u.widthSetter=function(a){q=a};u.heightSetter=function(a){K=a};u.paddingSetter=function(a){t(a)&&a!==z&&(z=u.padding=a,p())};u.paddingLeftSetter=function(a){t(a)&&a!==m&&(m=a,p())};u.alignSetter=function(a){r={left:0,center:.5,right:1}[a]};u.textSetter=function(a){a!==E&&R.textSetter(a);n();p()};u["stroke-widthSetter"]=function(a,b){a&&(ha=!0);A=a%2/2;y(b,a)};u.strokeSetter=u.fillSetter=u.rSetter=function(a,b){"fill"===b&&
a&&(ha=!0);y(b,a)};u.anchorXSetter=function(a,b){e=a;y(b,O(a)-A-D)};u.anchorYSetter=function(a,b){f=a;y(b,a-G)};u.xSetter=function(a){u.x=a;r&&(a-=r*((q||l.width)+z));D=O(a);u.attr("translateX",D)};u.ySetter=function(a){G=u.y=O(a);u.attr("translateY",G)};var C=u.css;return M(u,{css:function(a){if(a){var b={};a=x(a);v(u.textProps,function(c){a[c]!==E&&(b[c]=a[c],delete a[c])});R.css(b)}return C.call(u,a)},getBBox:function(){return{width:l.width+2*z,height:l.height+2*z,x:l.x-z,y:l.y-z}},shadow:function(a){I&&
I.shadow(a);return u},destroy:function(){qa(u.element,"mouseenter");qa(u.element,"mouseleave");R&&(R=R.destroy());I&&(I=I.destroy());S.prototype.destroy.call(u);u=w=n=p=y=null}})}};Fa.prototype={addLabel:function(){var a=this.axis,b=a.options,c=a.chart,d=a.categories,e=a.names,f=this.pos,g=b.labels,h=a.tickPositions,k=f===h[0],n=f===h[h.length-1],e=d?z(d[f],e[f],f):f,d=this.label,h=h.info,p;a.isDatetimeAxis&&h&&(p=b.dateTimeLabelFormats[h.higherRanks[f]||h.unitName]);this.isFirst=k;this.isLast=n;
b=a.labelFormatter.call({axis:a,chart:c,isFirst:k,isLast:n,dateTimeLabelFormat:p,value:a.isLog?C(m(e)):e});t(d)?d&&d.attr({text:b}):(this.labelLength=(this.label=d=t(b)&&g.enabled?c.renderer.text(b,0,0,g.useHTML).css(x(g.style)).add(a.labelGroup):null)&&d.getBBox().width,this.rotation=0)},getLabelSize:function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0},handleOverflow:function(a){var b=this.axis,c=a.x,d=b.chart.chartWidth,e=b.chart.spacing,f=z(b.labelLeft,U(b.pos,
e[3])),e=z(b.labelRight,H(b.pos+b.len,d-e[1])),g=this.label,h=this.rotation,k={left:0,center:.5,right:1}[b.labelAlign],n=g.getBBox().width,p=b.slotWidth,y=1,w,u={};if(h)0>h&&c-k*n<f?w=O(c/Da(h*Ha)-f):0<h&&c+k*n>e&&(w=O((d-c)/Da(h*Ha)));else if(d=c+(1-k)*n,c-k*n<f?p=a.x+p*(1-k)-f:d>e&&(p=e-a.x+p*k,y=-1),p=U(b.slotWidth,p),p<b.slotWidth&&"center"===b.labelAlign&&(a.x+=y*(b.slotWidth-p-k*(b.slotWidth-U(n,p)))),n>p||b.autoRotation&&g.styles.width)w=p;w&&(u.width=w,b.options.labels.style.textOverflow||
(u.textOverflow="ellipsis"),g.css(u))},getPosition:function(a,b,c,d){var e=this.axis,f=e.chart,g=d&&f.oldChartHeight||f.chartHeight;return{x:a?e.translate(b+c,null,null,d)+e.transB:e.left+e.offset+(e.opposite?(d&&f.oldChartWidth||f.chartWidth)-e.right-e.left:0),y:a?g-e.bottom+e.offset-(e.opposite?e.height:0):g-e.translate(b+c,null,null,d)-e.transB}},getLabelPosition:function(a,b,c,d,e,f,g,h){var k=this.axis,n=k.transA,p=k.reversed,y=k.staggerLines,w=k.tickRotCorr||{x:0,y:0};c=z(e.y,w.y+(2===k.side?
8:-(c.getBBox().height/2)));a=a+e.x+w.x-(f&&d?f*n*(p?-1:1):0);b=b+c-(f&&!d?f*n*(p?1:-1):0);y&&(b+=g/(h||1)%y*(k.labelOffset/y));return{x:a,y:O(b)}},getMarkPath:function(a,b,c,d,e,f){return f.crispLine(["M",a,b,"L",a+(e?0:-c),b+(e?c:0)],d)},render:function(a,b,c){var d=this.axis,e=d.options,f=d.chart.renderer,g=d.horiz,h=this.type,k=this.label,n=this.pos,p=e.labels,y=this.gridLine,w=h?h+"Grid":"grid",u=h?h+"Tick":"tick",R=e[w+"LineWidth"],I=e[w+"LineColor"],l=e[w+"LineDashStyle"],r=e[u+"Length"],w=
z(e[u+"Width"],!h&&d.isXAxis?1:0),t=e[u+"Color"],q=e[u+"Position"],u=this.mark,m=p.step,v=!0,K=d.tickmarkOffset,D=this.getPosition(g,n,K,b),G=D.x,D=D.y,A=g&&G===d.pos+d.len||!g&&D===d.pos?-1:1;c=z(c,1);this.isActive=!0;if(R&&(n=d.getPlotLinePath(n+K,R*A,b,!0),y===E&&(y={stroke:I,"stroke-width":R},l&&(y.dashstyle=l),h||(y.zIndex=1),b&&(y.opacity=0),this.gridLine=y=R?f.path(n).attr(y).add(d.gridGroup):null),!b&&y&&n))y[this.isNew?"attr":"animate"]({d:n,opacity:c});w&&r&&("inside"===q&&(r=-r),d.opposite&&
(r=-r),h=this.getMarkPath(G,D,r,w*A,g,f),u?u.animate({d:h,opacity:c}):this.mark=f.path(h).attr({stroke:t,"stroke-width":w,opacity:c}).add(d.axisGroup));k&&!isNaN(G)&&(k.xy=D=this.getLabelPosition(G,D,k,g,p,K,a,m),this.isFirst&&!this.isLast&&!z(e.showFirstLabel,1)||this.isLast&&!this.isFirst&&!z(e.showLastLabel,1)?v=!1:!g||d.isRadial||p.step||p.rotation||b||0===c||this.handleOverflow(D),m&&a%m&&(v=!1),v&&!isNaN(D.y)?(D.opacity=c,k[this.isNew?"attr":"animate"](D),this.isNew=!1):k.attr("y",-9999))},
destroy:function(){ha(this,this.axis)}};X.PlotLineOrBand=function(a,b){this.axis=a;b&&(this.options=b,this.id=b.id)};X.PlotLineOrBand.prototype={render:function(){var a=this,b=a.axis,c=b.horiz,d=a.options,e=d.label,f=a.label,g=d.width,h=d.to,k=d.from,n=t(k)&&t(h),p=d.value,y=d.dashStyle,w=a.svgElem,u=[],R,I=d.color,l=d.zIndex,r=d.events,z={},m=b.chart.renderer;b.isLog&&(k=oa(k),h=oa(h),p=oa(p));if(g)u=b.getPlotLinePath(p,g),z={stroke:I,"stroke-width":g},y&&(z.dashstyle=y);else if(n)u=b.getPlotBandPath(k,
h,d),I&&(z.fill=I),d.borderWidth&&(z.stroke=d.borderColor,z["stroke-width"]=d.borderWidth);else return;t(l)&&(z.zIndex=l);if(w)u?w.animate({d:u},null,w.onGetPath):(w.hide(),w.onGetPath=function(){w.show()},f&&(a.label=f=f.destroy()));else if(u&&u.length&&(a.svgElem=w=m.path(u).attr(z).add(),r))for(R in d=function(b){w.on(b,function(c){r[b].apply(a,[c])})},r)d(R);e&&t(e.text)&&u&&u.length&&0<b.width&&0<b.height?(e=x({align:c&&n&&"center",x:c?!n&&4:10,verticalAlign:!c&&n&&"middle",y:c?n?16:10:n?6:-4,
rotation:c&&!n&&90},e),f||(z={align:e.textAlign||e.align,rotation:e.rotation},t(l)&&(z.zIndex=l),a.label=f=m.text(e.text,0,0,e.useHTML).attr(z).css(e.style).add()),b=[u[1],u[4],n?u[6]:u[1]],n=[u[2],u[5],n?u[7]:u[2]],u=K(b),c=K(n),f.align(e,!1,{x:u,y:c,width:D(b)-u,height:D(n)-c}),f.show()):f&&f.hide();return a},destroy:function(){q(this.axis.plotLinesAndBands,this);delete this.axis;ha(this)}};var wa=X.Axis=function(){this.init.apply(this,arguments)};wa.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",
second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,gridLineColor:"#D8D8D8",labels:{enabled:!0,style:{color:"#606060",cursor:"default",fontSize:"11px"},x:0,y:15},lineColor:"#C0D0E0",lineWidth:1,minPadding:.01,maxPadding:.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:10,tickmarkPlacement:"between",tickPixelInterval:100,
tickPosition:"outside",title:{align:"middle",style:{color:"#707070"}},type:"linear"},defaultYAxisOptions:{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8,y:3},lineWidth:0,maxPadding:.05,minPadding:.05,startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{enabled:!1,formatter:function(){return X.numberFormat(this.total,-1)},style:x(ma.line.dataLabels.style,{color:"#000000"})}},defaultLeftAxisOptions:{labels:{x:-15,y:null},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15,
y:null},title:{rotation:90}},defaultBottomAxisOptions:{labels:{autoRotation:[-45],x:0,y:null},title:{rotation:0}},defaultTopAxisOptions:{labels:{autoRotation:[-45],x:0,y:-15},title:{rotation:0}},init:function(a,b){var c=b.isX;this.chart=a;this.horiz=a.inverted?!c:c;this.coll=(this.isXAxis=c)?"xAxis":"yAxis";this.opposite=b.opposite;this.side=b.side||(this.horiz?this.opposite?0:2:this.opposite?1:3);this.setOptions(b);var d=this.options,e=d.type;this.labelFormatter=d.labels.formatter||this.defaultLabelFormatter;
this.userOptions=b;this.minPixelPadding=0;this.reversed=d.reversed;this.visible=!1!==d.visible;this.zoomEnabled=!1!==d.zoomEnabled;this.categories=d.categories||"category"===e;this.names=this.names||[];this.isLog="logarithmic"===e;this.isDatetimeAxis="datetime"===e;this.isLinked=t(d.linkedTo);this.ticks={};this.labelEdge=[];this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands={};this.len=0;this.minRange=this.userMinRange=d.minRange||d.maxZoom;this.range=d.range;this.offset=d.offset||0;
this.stacks={};this.oldStacks={};this.stacksTouched=0;this.min=this.max=null;this.crosshair=z(d.crosshair,B(a.options.tooltip.crosshairs)[c?0:1],!1);var f,d=this.options.events;-1===Qa(this,a.axes)&&(c&&!this.isColorAxis?a.axes.splice(a.xAxis.length,0,this):a.axes.push(this),a[this.coll].push(this));this.series=this.series||[];a.inverted&&c&&this.reversed===E&&(this.reversed=!0);this.removePlotLine=this.removePlotBand=this.removePlotBandOrLine;for(f in d)ia(this,f,d[f]);this.isLog&&(this.val2lin=
oa,this.lin2val=m)},setOptions:function(a){this.options=x(this.defaultOptions,this.isXAxis?{}:this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],x(ka[this.coll],a))},defaultLabelFormatter:function(){var a=this.axis,b=this.value,c=a.categories,d=this.dateTimeLabelFormat,e=ka.lang.numericSymbols,f=e&&e.length,g,h=a.options.labels.format,a=a.isLog?b:a.tickInterval;if(h)g=G(h,this);else if(c)g=b;else if(d)g=
Ea(d,b);else if(f&&1E3<=a)for(;f--&&g===E;)c=Math.pow(1E3,f+1),a>=c&&0===10*b%c&&null!==e[f]&&(g=X.numberFormat(b/c,-1)+e[f]);g===E&&(g=1E4<=ca(b)?X.numberFormat(b,-1):X.numberFormat(b,-1,E,""));return g},getSeriesExtremes:function(){var a=this,b=a.chart;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=a.threshold=null;a.softThreshold=!a.isXAxis;a.buildStacks&&a.buildStacks();v(a.series,function(c){if(c.visible||!b.options.chart.ignoreHiddenSeries){var d=c.options,e=d.threshold,f;a.hasVisibleSeries=!0;a.isLog&&
0>=e&&(e=null);if(a.isXAxis)d=c.xData,d.length&&(a.dataMin=U(z(a.dataMin,d[0]),K(d)),a.dataMax=H(z(a.dataMax,d[0]),D(d)));else if(c.getExtremes(),f=c.dataMax,c=c.dataMin,t(c)&&t(f)&&(a.dataMin=U(z(a.dataMin,c),c),a.dataMax=H(z(a.dataMax,f),f)),t(e)&&(a.threshold=e),!d.softThreshold||a.isLog)a.softThreshold=!1}})},translate:function(a,b,c,d,e,f){var g=this.linkedParent||this,h=1,k=0,n=d?g.oldTransA:g.transA;d=d?g.oldMin:g.min;var p=g.minPixelPadding;e=(g.doPostTranslate||g.isLog&&e)&&g.lin2val;n||
(n=g.transA);c&&(h*=-1,k=g.len);g.reversed&&(h*=-1,k-=h*(g.sector||g.len));b?(a=a*h+k-p,a=a/n+d,e&&(a=g.lin2val(a))):(e&&(a=g.val2lin(a)),"between"===f&&(f=.5),a=h*(a-d)*n+k+h*p+(V(f)?n*f*g.pointRange:0));return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-(b?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,b,c,d,e){var f=this.chart,g=this.left,h=this.top,k,n,p=c&&f.oldChartHeight||f.chartHeight,
y=c&&f.oldChartWidth||f.chartWidth,w;k=this.transB;var u=function(a,b,c){if(a<b||a>c)d?a=U(H(b,a),c):w=!0;return a};e=z(e,this.translate(a,null,null,c));a=c=O(e+k);k=n=O(p-e-k);isNaN(e)?w=!0:this.horiz?(k=h,n=p-this.bottom,a=c=u(a,g,g+this.width)):(a=g,c=y-this.right,k=n=u(k,h,h+this.height));return w&&!d?null:f.renderer.crispLine(["M",a,k,"L",c,n],b||1)},getLinearTickPositions:function(a,b,c){var d,e=C(Y(b/a)*a),f=C(xa(c/a)*a),g=[];if(b===c&&V(b))return[b];for(b=e;b<=f;){g.push(b);b=C(b+a);if(b===
d)break;d=b}return g},getMinorTickPositions:function(){var a=this.options,b=this.tickPositions,c=this.minorTickInterval,d=[],e,f=this.pointRangePadding||0;e=this.min-f;var f=this.max+f,g=f-e;if(g&&g/c<this.len/3)if(this.isLog)for(f=b.length,e=1;e<f;e++)d=d.concat(this.getLogTickPositions(c,b[e-1],b[e],!0));else if(this.isDatetimeAxis&&"auto"===a.minorTickInterval)d=d.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c),e,f,a.startOfWeek));else for(b=e+(b[0]-e)%c;b<=f;b+=c)d.push(b);0!==d.length&&
this.trimTicks(d,a.startOnTick,a.endOnTick);return d},adjustForMinRange:function(){var a=this.options,b=this.min,c=this.max,d,e=this.dataMax-this.dataMin>=this.minRange,f,g,h,k,n,p;this.isXAxis&&this.minRange===E&&!this.isLog&&(t(a.min)||t(a.max)?this.minRange=null:(v(this.series,function(a){k=a.xData;for(g=n=a.xIncrement?1:k.length-1;0<g;g--)if(h=k[g]-k[g-1],f===E||h<f)f=h}),this.minRange=U(5*f,this.dataMax-this.dataMin)));c-b<this.minRange&&(p=this.minRange,d=(p-c+b)/2,d=[b-d,z(a.min,b-d)],e&&(d[2]=
this.dataMin),b=D(d),c=[b+p,z(a.max,b+p)],e&&(c[2]=this.dataMax),c=K(c),c-b<p&&(d[0]=c-p,d[1]=z(a.min,c-p),b=D(d)));this.min=b;this.max=c},setAxisTranslation:function(a){var b=this,c=b.max-b.min,d=b.axisPointRange||0,e,f=0,g=0,h=b.linkedParent,k=!!b.categories,n=b.transA,p=b.isXAxis;if(p||k||d)h?(f=h.minPointOffset,g=h.pointRangePadding):v(b.series,function(a){var c=k?1:p?a.pointRange:b.axisPointRange||0,h=a.options.pointPlacement,n=a.closestPointRange;d=H(d,c);b.single||(f=H(f,ja(h)?0:c/2),g=H(g,
"on"===h?0:c));!a.noSharedTooltip&&t(n)&&(e=t(e)?U(e,n):n)}),h=b.ordinalSlope&&e?b.ordinalSlope/e:1,b.minPointOffset=f*=h,b.pointRangePadding=g*=h,b.pointRange=U(d,c),p&&(b.closestPointRange=e);a&&(b.oldTransA=n);b.translationSlope=b.transA=n=b.len/(c+g||1);b.transB=b.horiz?b.left:b.bottom;b.minPixelPadding=n*f},minFromRange:function(){return this.max-this.range},setTickInterval:function(a){var b=this,c=b.chart,d=b.options,e=b.isLog,f=b.isDatetimeAxis,g=b.isXAxis,h=b.isLinked,k=d.maxPadding,n=d.minPadding,
p=d.tickInterval,y=d.tickPixelInterval,w=b.categories,u=b.threshold,R=b.softThreshold,I,l,m,q;f||w||h||this.getTickAmount();m=z(b.userMin,d.min);q=z(b.userMax,d.max);h?(b.linkedParent=c[b.coll][d.linkedTo],c=b.linkedParent.getExtremes(),b.min=z(c.min,c.dataMin),b.max=z(c.max,c.dataMax),d.type!==b.linkedParent.options.type&&ba(11,1)):(!R&&t(u)&&(b.dataMin>=u?(I=u,n=0):b.dataMax<=u&&(l=u,k=0)),b.min=z(m,I,b.dataMin),b.max=z(q,l,b.dataMax));e&&(!a&&0>=U(b.min,z(b.dataMin,b.min))&&ba(10,1),b.min=C(oa(b.min),
15),b.max=C(oa(b.max),15));b.range&&t(b.max)&&(b.userMin=b.min=m=H(b.min,b.minFromRange()),b.userMax=q=b.max,b.range=null);b.beforePadding&&b.beforePadding();b.adjustForMinRange();!(w||b.axisPointRange||b.usePercentage||h)&&t(b.min)&&t(b.max)&&(c=b.max-b.min)&&(!t(m)&&n&&(b.min-=c*n),!t(q)&&k&&(b.max+=c*k));V(d.floor)&&(b.min=H(b.min,d.floor));V(d.ceiling)&&(b.max=U(b.max,d.ceiling));R&&t(b.dataMin)&&(u=u||0,!t(m)&&b.min<u&&b.dataMin>=u?b.min=u:!t(q)&&b.max>u&&b.dataMax<=u&&(b.max=u));b.tickInterval=
b.min===b.max||void 0===b.min||void 0===b.max?1:h&&!p&&y===b.linkedParent.options.tickPixelInterval?p=b.linkedParent.tickInterval:z(p,this.tickAmount?(b.max-b.min)/H(this.tickAmount-1,1):void 0,w?1:(b.max-b.min)*y/H(b.len,y));g&&!a&&v(b.series,function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(!0);b.beforeSetTickPositions&&b.beforeSetTickPositions();b.postProcessTickInterval&&(b.tickInterval=b.postProcessTickInterval(b.tickInterval));b.pointRange&&(b.tickInterval=
H(b.pointRange,b.tickInterval));a=z(d.minTickInterval,b.isDatetimeAxis&&b.closestPointRange);!p&&b.tickInterval<a&&(b.tickInterval=a);f||e||p||(b.tickInterval=r(b.tickInterval,null,na.pow(10,Y(na.log(b.tickInterval)/na.LN10)),z(d.allowDecimals,!(.5<b.tickInterval&&5>b.tickInterval&&1E3<b.max&&9999>b.max)),!!this.tickAmount));!this.tickAmount&&this.len&&(b.tickInterval=b.unsquish());this.setTickPositions()},setTickPositions:function(){var a=this.options,b,c=a.tickPositions,d=a.tickPositioner,e=a.startOnTick,
f=a.endOnTick,g;this.tickmarkOffset=this.categories&&"between"===a.tickmarkPlacement&&1===this.tickInterval?.5:0;this.minorTickInterval="auto"===a.minorTickInterval&&this.tickInterval?this.tickInterval/5:a.minorTickInterval;this.tickPositions=b=c&&c.slice();!b&&(b=this.isDatetimeAxis?this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval,a.units),this.min,this.max,a.startOfWeek,this.ordinalPositions,this.closestPointRange,!0):this.isLog?this.getLogTickPositions(this.tickInterval,this.min,
this.max):this.getLinearTickPositions(this.tickInterval,this.min,this.max),b.length>this.len&&(b=[b[0],b.pop()]),this.tickPositions=b,d&&(d=d.apply(this,[this.min,this.max])))&&(this.tickPositions=b=d);this.isLinked||(this.trimTicks(b,e,f),this.min===this.max&&t(this.min)&&!this.tickAmount&&(g=!0,this.min-=.5,this.max+=.5),this.single=g,c||d||this.adjustTickAmount())},trimTicks:function(a,b,c){var d=a[0],e=a[a.length-1],f=this.minPointOffset||0;b?this.min=d:this.min-f>d&&a.shift();c?this.max=e:this.max+
f<e&&a.pop();0===a.length&&t(d)&&a.push((e+d)/2)},getTickAmount:function(){var a={},b,c=this.options,d=c.tickAmount,e=c.tickPixelInterval;!t(c.tickInterval)&&this.len<e&&!this.isRadial&&!this.isLog&&c.startOnTick&&c.endOnTick&&(d=2);d||!1===this.chart.options.chart.alignTicks||!1===c.alignTicks||(v(this.chart[this.coll],function(c){var d=c.options,e=c.horiz,d=[e?d.left:d.top,e?d.width:d.height,d.pane].join();c.series.length&&(a[d]?b=!0:a[d]=1)}),b&&(d=xa(this.len/e)+1));4>d&&(this.finalTickAmt=d,
d=5);this.tickAmount=d},adjustTickAmount:function(){var a=this.tickInterval,b=this.tickPositions,c=this.tickAmount,d=this.finalTickAmt,e=b&&b.length;if(e<c){for(;b.length<c;)b.push(C(b[b.length-1]+a));this.transA*=(e-1)/(c-1);this.max=b[b.length-1]}else e>c&&(this.tickInterval*=2,this.setTickPositions());if(t(d)){for(a=c=b.length;a--;)(3===d&&1===a%2||2>=d&&0<a&&a<c-1)&&b.splice(a,1);this.finalTickAmt=E}},setScale:function(){var a,b;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;
this.setAxisSize();b=this.len!==this.oldAxisLength;v(this.series,function(b){if(b.isDirtyData||b.isDirty||b.xAxis.isDirty)a=!0});b||a||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax?(this.resetStacks&&this.resetStacks(),this.forceRedraw=!1,this.getSeriesExtremes(),this.setTickInterval(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,this.isDirty||(this.isDirty=b||this.min!==this.oldMin||this.max!==this.oldMax)):this.cleanStacks&&this.cleanStacks()},
setExtremes:function(a,b,c,d,e){var f=this,g=f.chart;c=z(c,!0);v(f.series,function(a){delete a.kdTree});e=M(e,{min:a,max:b});da(f,"setExtremes",e,function(){f.userMin=a;f.userMax=b;f.eventArgs=e;c&&g.redraw(d)})},zoom:function(a,b){var c=this.dataMin,d=this.dataMax,e=this.options,f=U(c,z(e.min,c)),e=H(d,z(e.max,d));this.allowZoomOutside||(t(c)&&a<=f&&(a=f),t(d)&&b>=e&&(b=e));this.displayBtn=a!==E||b!==E;this.setExtremes(a,b,!1,E,{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,
b=this.options,c=b.offsetLeft||0,d=this.horiz,e=z(b.width,a.plotWidth-c+(b.offsetRight||0)),f=z(b.height,a.plotHeight),g=z(b.top,a.plotTop),b=z(b.left,a.plotLeft+c),c=/%$/;c.test(f)&&(f=parseFloat(f)/100*a.plotHeight);c.test(g)&&(g=parseFloat(g)/100*a.plotHeight+a.plotTop);this.left=b;this.top=g;this.width=e;this.height=f;this.bottom=a.chartHeight-f-g;this.right=a.chartWidth-e-b;this.len=H(d?e:f,0);this.pos=d?b:g},getExtremes:function(){var a=this.isLog;return{min:a?C(m(this.min)):this.min,max:a?
C(m(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=this.isLog,c=b?m(this.min):this.min,b=b?m(this.max):this.max;null===a?a=0>b?b:c:c>a?a=c:b<a&&(a=b);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){a=(z(a,0)-90*this.side+720)%360;return 15<a&&165>a?"right":195<a&&345>a?"left":"center"},unsquish:function(){var a=this.ticks,b=this.options.labels,c=this.horiz,d=this.tickInterval,e=d,f=this.len/(((this.categories?
1:0)+this.max-this.min)/d),g,h=b.rotation,k=this.chart.renderer.fontMetrics(b.style.fontSize,a[0]&&a[0].label),n,p=Number.MAX_VALUE,y,w=function(a){a/=f||1;a=1<a?xa(a):1;return a*d};c?(y=!b.staggerLines&&!b.step&&(t(h)?[h]:f<z(b.autoRotationLimit,80)&&b.autoRotation))&&v(y,function(a){var b;if(a===h||a&&-90<=a&&90>=a)n=w(ca(k.h/Ga(Ha*a))),b=n+ca(a/360),b<p&&(p=b,g=a,e=n)}):b.step||(e=w(k.h));this.autoRotation=y;this.labelRotation=z(g,h);return e},renderUnsquish:function(){var a=this.chart,b=a.renderer,
c=this.tickPositions,d=this.ticks,e=this.options.labels,f=this.horiz,g=a.margin,h=this.categories?c.length:c.length-1,k=this.slotWidth=f&&!e.step&&!e.rotation&&(this.staggerLines||1)*a.plotWidth/h||!f&&(g[3]&&g[3]-a.spacing[3]||.33*a.chartWidth),n=H(1,O(k-2*(e.padding||5))),p={},g=b.fontMetrics(e.style.fontSize,d[0]&&d[0].label),h=e.style.textOverflow,y,w=0;ja(e.rotation)||(p.rotation=e.rotation||0);if(this.autoRotation)v(c,function(a){(a=d[a])&&a.labelLength>w&&(w=a.labelLength)}),w>n&&w>g.h?p.rotation=
this.labelRotation:this.labelRotation=0;else if(k&&(y={width:n+"px"},!h))for(y.textOverflow="clip",k=c.length;!f&&k--;)if(n=c[k],n=d[n].label)"ellipsis"===n.styles.textOverflow&&n.css({textOverflow:"clip"}),n.getBBox().height>this.len/c.length-(g.h-g.f)&&(n.specCss={textOverflow:"ellipsis"});p.rotation&&(y={width:(w>.5*a.chartHeight?.33*a.chartHeight:a.chartHeight)+"px"},h||(y.textOverflow="ellipsis"));this.labelAlign=p.align=e.align||this.autoLabelAlign(this.labelRotation);v(c,function(a){var b=
(a=d[a])&&a.label;b&&(b.attr(p),y&&b.css(x(y,b.specCss)),delete b.specCss,a.rotation=p.rotation)});this.tickRotCorr=b.rotCorr(g.b,this.labelRotation||0,2===this.side)},hasData:function(){return this.hasVisibleSeries||t(this.min)&&t(this.max)&&!!this.tickPositions},getOffset:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,e=a.tickPositions,f=a.ticks,g=a.horiz,h=a.side,k=b.inverted?[1,0,3,2][h]:h,n,p,y=0,w,u=0,l=d.title,I=d.labels,r=0,m=b.axisOffset,b=b.clipOffset,q=[-1,1,1,-1][h],D,K=a.axisParent;
n=a.hasData();a.showAxis=p=n||z(d.showEmpty,!0);a.staggerLines=a.horiz&&I.staggerLines;a.axisGroup||(a.gridGroup=c.g("grid").attr({zIndex:d.gridZIndex||1}).add(K),a.axisGroup=c.g("axis").attr({zIndex:d.zIndex||2}).add(K),a.labelGroup=c.g("axis-labels").attr({zIndex:I.zIndex||7}).addClass("highcharts-"+a.coll.toLowerCase()+"-labels").add(K));if(n||a.isLinked)v(e,function(b){f[b]?f[b].addLabel():f[b]=new Fa(a,b)}),a.renderUnsquish(),v(e,function(b){if(0===h||2===h||{1:"left",3:"right"}[h]===a.labelAlign)r=
H(f[b].getLabelSize(),r)}),a.staggerLines&&(r*=a.staggerLines,a.labelOffset=r);else for(D in f)f[D].destroy(),delete f[D];l&&l.text&&!1!==l.enabled&&(a.axisTitle||(a.axisTitle=c.text(l.text,0,0,l.useHTML).attr({zIndex:7,rotation:l.rotation||0,align:l.textAlign||{low:"left",middle:"center",high:"right"}[l.align]}).addClass("highcharts-"+this.coll.toLowerCase()+"-title").css(l.style).add(a.axisGroup),a.axisTitle.isNew=!0),p&&(y=a.axisTitle.getBBox()[g?"height":"width"],w=l.offset,u=t(w)?0:z(l.margin,
g?5:10)),a.axisTitle[p?"show":"hide"]());a.offset=q*z(d.offset,m[h]);a.tickRotCorr=a.tickRotCorr||{x:0,y:0};c=2===h?a.tickRotCorr.y:0;g=r+u+(r&&q*(g?z(I.y,a.tickRotCorr.y+8):I.x)-c);a.axisTitleMargin=z(w,g);m[h]=H(m[h],a.axisTitleMargin+y+q*a.offset,g);d=d.offset?0:2*Y(d.lineWidth/2);b[k]=H(b[k],d)},getLinePath:function(a){var b=this.chart,c=this.opposite,d=this.offset,e=this.horiz,f=this.left+(c?this.width:0)+d,d=b.chartHeight-this.bottom-(c?this.height:0)+d;c&&(a*=-1);return b.renderer.crispLine(["M",
e?this.left:f,e?d:this.top,"L",e?b.chartWidth-this.right:f,e?d:b.chartHeight-this.bottom],a)},getTitlePosition:function(){var a=this.horiz,b=this.left,c=this.top,d=this.len,e=this.options.title,f=a?b:c,g=this.opposite,h=this.offset,k=e.x||0,n=e.y||0,p=J(e.style.fontSize||12),d={low:f+(a?0:d),middle:f+d/2,high:f+(a?d:0)}[e.align],b=(a?c+this.height:b)+(a?1:-1)*(g?-1:1)*this.axisTitleMargin+(2===this.side?p:0);return{x:a?d+k:b+(g?this.width:0)+h+k,y:a?b+n-(g?this.height:0)+h:d+n}},render:function(){var a=
this,b=a.chart,c=b.renderer,d=a.options,e=a.isLog,f=a.isLinked,g=a.tickPositions,h=a.axisTitle,k=a.ticks,n=a.minorTicks,p=a.alternateBands,y=d.stackLabels,w=d.alternateGridColor,u=a.tickmarkOffset,l=d.lineWidth,I,r=b.hasRendered&&t(a.oldMin)&&!isNaN(a.oldMin),z=a.showAxis,q=c.globalAnimation,D,K;a.labelEdge.length=0;a.overlap=!1;v([k,n,p],function(a){for(var b in a)a[b].isActive=!1});if(a.hasData()||f)a.minorTickInterval&&!a.categories&&v(a.getMinorTickPositions(),function(b){n[b]||(n[b]=new Fa(a,
b,"minor"));r&&n[b].isNew&&n[b].render(null,!0);n[b].render(null,!1,1)}),g.length&&(v(g,function(b,c){if(!f||b>=a.min&&b<=a.max)k[b]||(k[b]=new Fa(a,b)),r&&k[b].isNew&&k[b].render(c,!0,.1),k[b].render(c)}),u&&(0===a.min||a.single)&&(k[-1]||(k[-1]=new Fa(a,-1,null,!0)),k[-1].render(-1))),w&&v(g,function(b,c){K=g[c+1]!==E?g[c+1]+u:a.max-u;0===c%2&&b<a.max&&K<=a.max-u&&(p[b]||(p[b]=new X.PlotLineOrBand(a)),D=b+u,p[b].options={from:e?m(D):D,to:e?m(K):K,color:w},p[b].render(),p[b].isActive=!0)}),a._addedPlotLB||
(v((d.plotLines||[]).concat(d.plotBands||[]),function(b){a.addPlotBandOrLine(b)}),a._addedPlotLB=!0);v([k,n,p],function(a){var c,d,e=[],f=q?q.duration||500:0,g=function(){for(d=e.length;d--;)a[e[d]]&&!a[e[d]].isActive&&(a[e[d]].destroy(),delete a[e[d]])};for(c in a)a[c].isActive||(a[c].render(c,!1,0),a[c].isActive=!1,e.push(c));a!==p&&b.hasRendered&&f?f&&setTimeout(g,f):g()});l&&(I=a.getLinePath(l),a.axisLine?a.axisLine.animate({d:I}):a.axisLine=c.path(I).attr({stroke:d.lineColor,"stroke-width":l,
zIndex:7}).add(a.axisGroup),a.axisLine[z?"show":"hide"]());h&&z&&(h[h.isNew?"attr":"animate"](a.getTitlePosition()),h.isNew=!1);y&&y.enabled&&a.renderStackTotals();a.isDirty=!1},redraw:function(){this.visible&&(this.render(),v(this.plotLinesAndBands,function(a){a.render()}));v(this.series,function(a){a.isDirty=!0})},destroy:function(a){var b=this,c=b.stacks,d,e=b.plotLinesAndBands;a||qa(b);for(d in c)ha(c[d]),c[d]=null;v([b.ticks,b.minorTicks,b.alternateBands],function(a){ha(a)});for(a=e.length;a--;)e[a].destroy();
v("stackTotalGroup axisLine axisTitle axisGroup cross gridGroup labelGroup".split(" "),function(a){b[a]&&(b[a]=b[a].destroy())});this.cross&&this.cross.destroy()},drawCrosshair:function(a,b){var c,d=this.crosshair,e=d.animation;if(!this.crosshair||!1===(t(b)||!z(this.crosshair.snap,!0))||b&&b.series&&b.series[this.coll]!==this)this.hideCrosshair();else if(z(d.snap,!0)?t(b)&&(c=this.isXAxis?b.plotX:this.len-b.plotY):c=this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos,c=this.isRadial?this.getPlotLinePath(this.isXAxis?
b.x:z(b.stackY,b.y))||null:this.getPlotLinePath(null,null,null,null,c)||null,null===c)this.hideCrosshair();else if(this.cross)this.cross.attr({visibility:"visible"})[e?"animate":"attr"]({d:c},e);else e=this.categories&&!this.isRadial,e={"stroke-width":d.width||(e?this.transA:1),stroke:d.color||(e?"rgba(155,200,255,0.2)":"#C0C0C0"),zIndex:d.zIndex||2},d.dashStyle&&(e.dashstyle=d.dashStyle),this.cross=this.chart.renderer.path(c).attr(e).add()},hideCrosshair:function(){this.cross&&this.cross.hide()}};
M(wa.prototype,{getPlotBandPath:function(a,b){var c=this.getPlotLinePath(b,null,null,!0),d=this.getPlotLinePath(a,null,null,!0);d&&c&&d.toString()!==c.toString()?d.push(c[4],c[5],c[1],c[2]):d=null;return d},addPlotBand:function(a){return this.addPlotBandOrLine(a,"plotBands")},addPlotLine:function(a){return this.addPlotBandOrLine(a,"plotLines")},addPlotBandOrLine:function(a,b){var c=(new X.PlotLineOrBand(this,a)).render(),d=this.userOptions;c&&(b&&(d[b]=d[b]||[],d[b].push(a)),this.plotLinesAndBands.push(c));
return c},removePlotBandOrLine:function(a){for(var b=this.plotLinesAndBands,c=this.options,d=this.userOptions,e=b.length;e--;)b[e].id===a&&b[e].destroy();v([c.plotLines||[],d.plotLines||[],c.plotBands||[],d.plotBands||[]],function(b){for(e=b.length;e--;)b[e].id===a&&q(b,b[e])})}});wa.prototype.getTimeTicks=function(a,b,c,d){var e=[],f={},g=ka.global.useUTC,h,k=new za(b-T(b)),n=a.unitRange,p=a.count;if(t(b)){k[sb](n>=Z.second?0:p*Y(k.getMilliseconds()/p));if(n>=Z.second)k[tb](n>=Z.minute?0:p*Y(k.getSeconds()/
p));if(n>=Z.minute)k[ub](n>=Z.hour?0:p*Y(k[hb]()/p));if(n>=Z.hour)k[vb](n>=Z.day?0:p*Y(k[ib]()/p));if(n>=Z.day)k[kb](n>=Z.month?1:p*Y(k[Ka]()/p));n>=Z.month&&(k[lb](n>=Z.year?0:p*Y(k[La]()/p)),h=k[Ma]());if(n>=Z.year)k[mb](h-h%p);if(n===Z.week)k[kb](k[Ka]()-k[jb]()+z(d,1));b=1;if(gb||Ta)k=k.getTime(),k=new za(k+T(k));h=k[Ma]();d=k.getTime();for(var y=k[La](),w=k[Ka](),u=(Z.day+(g?T(k):6E4*k.getTimezoneOffset()))%Z.day;d<c;)e.push(d),d=n===Z.year?Va(h+b*p,0):n===Z.month?Va(h,y+b*p):g||n!==Z.day&&n!==
Z.week?d+n*p:Va(h,y,w+b*p*(n===Z.day?1:7)),b++;e.push(d);v(Za(e,function(a){return n<=Z.hour&&a%Z.day===u}),function(a){f[a]="day"})}e.info=M(a,{higherRanks:f,totalRange:n*p});return e};wa.prototype.normalizeTimeTickInterval=function(a,b){var c=b||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]],d=c[c.length-1],e=Z[d[0]],f=d[1],g;for(g=0;g<c.length&&!(d=
c[g],e=Z[d[0]],f=d[1],c[g+1]&&a<=(e*f[f.length-1]+Z[c[g+1][0]])/2);g++);e===Z.year&&a<5*e&&(f=[1,2,5]);c=r(a/e,f,"year"===d[0]?H(na.pow(10,Y(na.log(a/e)/na.LN10)),1):1);return{unitRange:e,count:c,unitName:d[0]}};var Db=X.Tooltip=function(){this.init.apply(this,arguments)};Db.prototype={init:function(a,b){var c=b.borderWidth,d=b.style,e=J(d.padding);this.chart=a;this.options=b;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.label=a.renderer.label("",0,0,b.shape||"callout",null,null,b.useHTML,
null,"tooltip").attr({padding:e,fill:b.backgroundColor,"stroke-width":c,r:b.borderRadius,zIndex:8}).css(d).css({padding:0}).add().attr({y:-9999});va||this.label.shadow(b.shadow);this.shared=b.shared},destroy:function(){this.label&&(this.label=this.label.destroy());clearTimeout(this.hideTimer);clearTimeout(this.tooltipTimeout)},move:function(a,b,c,d){var e=this,f=e.now,g=!1!==e.options.animation&&!e.isHidden&&(1<ca(a-f.x)||1<ca(b-f.y)),h=e.followPointer||1<e.len;M(f,{x:g?(2*f.x+a)/3:a,y:g?(f.y+b)/
2:b,anchorX:h?E:g?(2*f.anchorX+c)/3:c,anchorY:h?E:g?(f.anchorY+d)/2:d});e.label.attr(f);g&&(clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(a,b,c,d)},32))},hide:function(a){var b=this;clearTimeout(this.hideTimer);this.isHidden||(this.hideTimer=setTimeout(function(){b.label.fadeOut();b.isHidden=!0},z(a,this.options.hideDelay,500)))},getAnchor:function(a,b){var c,d=this.chart,e=d.inverted,f=d.plotTop,g=d.plotLeft,h=0,k=0,n,p;a=B(a);c=a[0].tooltipPos;this.followPointer&&
b&&(b.chartX===E&&(b=d.pointer.normalize(b)),c=[b.chartX-d.plotLeft,b.chartY-f]);c||(v(a,function(a){n=a.series.yAxis;p=a.series.xAxis;h+=a.plotX+(!e&&p?p.left-g:0);k+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!e&&n?n.top-f:0)}),h/=a.length,k/=a.length,c=[e?d.plotWidth-k:h,this.shared&&!e&&1<a.length&&b?b.chartY-f:e?d.plotHeight-h:k]);return Ra(c,O)},getPosition:function(a,b,c){var d=this.chart,e=this.distance,f={},g=c.h||0,h,k=["y",d.chartHeight,b,c.plotY+d.plotTop,d.plotTop,d.plotTop+d.plotHeight],
n=["x",d.chartWidth,a,c.plotX+d.plotLeft,d.plotLeft,d.plotLeft+d.plotWidth],p=z(c.ttBelow,d.inverted&&!c.negative||!d.inverted&&c.negative),y=function(a,b,c,d,h,k){var n=c<d-e,w=d+e+c<b,u=d-e-c;d+=e;if(p&&w)f[a]=d;else if(!p&&n)f[a]=u;else if(n)f[a]=U(k-c,0>u-g?u:u-g);else if(w)f[a]=H(h,d+g+c>b?d:d+g);else return!1},w=function(a,b,c,d){if(d<e||d>b-e)return!1;f[a]=d<c/2?1:d>b-c/2?b-c-2:d-c/2},u=function(a){var b=k;k=n;n=b;h=a},l=function(){!1!==y.apply(0,k)?!1!==w.apply(0,n)||h||(u(!0),l()):h?f.x=
f.y=0:(u(!0),l())};(d.inverted||1<this.len)&&u();l();return f},defaultFormatter:function(a){var b=this.points||B(this),c;c=[a.tooltipFooterHeaderFormatter(b[0])];c=c.concat(a.bodyFormatter(b));c.push(a.tooltipFooterHeaderFormatter(b[0],!0));return c.join("")},refresh:function(a,b){var c=this.chart,d=this.label,e=this.options,f,g,h,k={},n,p=[];n=e.formatter||this.defaultFormatter;var k=c.hoverPoints,y,w=this.shared;clearTimeout(this.hideTimer);this.followPointer=B(a)[0].series.tooltipOptions.followPointer;
h=this.getAnchor(a,b);f=h[0];g=h[1];!w||a.series&&a.series.noSharedTooltip?k=a.getLabelConfig():(c.hoverPoints=a,k&&v(k,function(a){a.setState()}),v(a,function(a){a.setState("hover");p.push(a.getLabelConfig())}),k={x:a[0].category,y:a[0].y},k.points=p,this.len=p.length,a=a[0]);n=n.call(k,this);k=a.series;this.distance=z(k.tooltipOptions.distance,16);!1===n?this.hide():(this.isHidden&&(Sa(d),d.attr("opacity",1).show()),d.attr({text:n}),y=e.borderColor||a.color||k.color||"#606060",d.attr({stroke:y}),
this.updatePosition({plotX:f,plotY:g,negative:a.negative,ttBelow:a.ttBelow,h:h[2]||0}),this.isHidden=!1);da(c,"tooltipRefresh",{text:n,x:f+c.plotLeft,y:g+c.plotTop,borderColor:y})},updatePosition:function(a){var b=this.chart,c=this.label,c=(this.options.positioner||this.getPosition).call(this,c.width,c.height,a);this.move(O(c.x),O(c.y||0),a.plotX+b.plotLeft,a.plotY+b.plotTop)},getXDateFormat:function(a,b,c){var d;b=b.dateTimeLabelFormats;var e=c&&c.closestPointRange,f,g={millisecond:15,second:12,
minute:9,hour:6,day:3},h,k="millisecond";if(e){h=Ea("%m-%d %H:%M:%S.%L",a.x);for(f in Z){if(e===Z.week&&+Ea("%w",a.x)===c.options.startOfWeek&&"00:00:00.000"===h.substr(6)){f="week";break}else if(Z[f]>e){f=k;break}else if(g[f]&&h.substr(g[f])!=="01-01 00:00:00.000".substr(g[f]))break;"week"!==f&&(k=f)}f&&(d=b[f])}else d=b.day;return d||b.year},tooltipFooterHeaderFormatter:function(a,b){var c=b?"footer":"header",d=a.series,e=d.tooltipOptions,f=e.xDateFormat,g=d.xAxis,h=g&&"datetime"===g.options.type&&
V(a.key),c=e[c+"Format"];h&&!f&&(f=this.getXDateFormat(a,e,g));h&&f&&(c=c.replace("{point.key}","{point.key:"+f+"}"));return G(c,{point:a,series:d})},bodyFormatter:function(a){return Ra(a,function(a){var c=a.series.tooltipOptions;return(c.pointFormatter||a.point.tooltipFormatter).call(a.point,c.pointFormat)})}};var Ba;Oa=P.documentElement.ontouchstart!==E;var Eb=X.Pointer=function(a,b){this.init(a,b)};Eb.prototype={init:function(a,b){var c=b.chart,d=c.events,e=va?"":c.zoomType,c=a.inverted,f;this.options=
b;this.chart=a;this.zoomX=f=/x/.test(e);this.zoomY=e=/y/.test(e);this.zoomHor=f&&!c||e&&c;this.zoomVert=e&&!c||f&&c;this.hasZoom=f||e;this.runChartClick=d&&!!d.click;this.pinchDown=[];this.lastValidTouch={};X.Tooltip&&b.tooltip.enabled&&(a.tooltip=new Db(a,b.tooltip),this.followTouchMove=z(b.tooltip.followTouchMove,!0));this.setDOMEvents()},normalize:function(a,b){var c,d;a=a||window.event;a=Jb(a);a.target||(a.target=a.srcElement);d=a.touches?a.touches.length?a.touches.item(0):a.changedTouches[0]:
a;b||(this.chartPosition=b=Ib(this.chart.container));d.pageX===E?(c=H(a.x,a.clientX-b.left),d=a.y):(c=d.pageX-b.left,d=d.pageY-b.top);return M(a,{chartX:O(c),chartY:O(d)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};v(this.chart.axes,function(c){b[c.isXAxis?"xAxis":"yAxis"].push({axis:c,value:c.toValue(a[c.horiz?"chartX":"chartY"])})});return b},runPointActions:function(a){var b=this.chart,c=b.series,d=b.tooltip,e=d?d.shared:!1,f=b.hoverPoint,g=b.hoverSeries,h,k=Number.MAX_VALUE,n,p,y=[],
w,u;if(!e&&!g)for(h=0;h<c.length;h++)if(c[h].directTouch||!c[h].options.stickyTracking)c=[];g&&(e?g.noSharedTooltip:g.directTouch)&&f?w=f:(v(c,function(b){n=b.noSharedTooltip&&e;p=!e&&b.directTouch;b.visible&&!n&&!p&&z(b.options.enableMouseTracking,!0)&&(u=b.searchPoint(a,!n&&1===b.kdDimensions))&&y.push(u)}),v(y,function(a){a&&"number"===typeof a.dist&&a.dist<k&&(k=a.dist,w=a)}));if(w&&(w!==this.prevKDPoint||d&&d.isHidden)){if(e&&!w.series.noSharedTooltip){for(h=y.length;h--;)(y[h].clientX!==w.clientX||
y[h].series.noSharedTooltip)&&y.splice(h,1);y.length&&d&&d.refresh(y,a);v(y,function(b){b.onMouseOver(a,b!==(g&&g.directTouch&&f||w))})}else if(d&&d.refresh(w,a),!g||!g.directTouch)w.onMouseOver(a);this.prevKDPoint=w}else c=g&&g.tooltipOptions.followPointer,d&&c&&!d.isHidden&&(c=d.getAnchor([{}],a),d.updatePosition({plotX:c[0],plotY:c[1]}));d&&!this._onDocumentMouseMove&&(this._onDocumentMouseMove=function(a){if(pa[Ba])pa[Ba].pointer.onDocumentMouseMove(a)},ia(P,"mousemove",this._onDocumentMouseMove));
v(b.axes,function(b){b.drawCrosshair(a,z(w,f))})},reset:function(a,b){var c=this.chart,d=c.hoverSeries,e=c.hoverPoint,f=c.hoverPoints,g=c.tooltip,h=g&&g.shared?f:e;(a=a&&g&&h)&&B(h)[0].plotX===E&&(a=!1);if(a)g.refresh(h),e&&(e.setState(e.state,!0),v(c.axes,function(a){z(a.options.crosshair&&a.options.crosshair.snap,!0)?a.drawCrosshair(null,e):a.hideCrosshair()}));else{if(e)e.onMouseOut();f&&v(f,function(a){a.setState()});if(d)d.onMouseOut();g&&g.hide(b);this._onDocumentMouseMove&&(qa(P,"mousemove",
this._onDocumentMouseMove),this._onDocumentMouseMove=null);v(c.axes,function(a){a.hideCrosshair()});this.hoverX=c.hoverPoints=c.hoverPoint=null}},scaleGroups:function(a,b){var c=this.chart,d;v(c.series,function(e){d=a||e.getPlotBox();e.xAxis&&e.xAxis.zoomEnabled&&(e.group.attr(d),e.markerGroup&&(e.markerGroup.attr(d),e.markerGroup.clip(b?c.clipRect:null)),e.dataLabelsGroup&&e.dataLabelsGroup.attr(d))});c.clipRect.attr(b||c.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=
!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},drag:function(a){var b=this.chart,c=b.options.chart,d=a.chartX,e=a.chartY,f=this.zoomHor,g=this.zoomVert,h=b.plotLeft,k=b.plotTop,n=b.plotWidth,p=b.plotHeight,y,w=this.selectionMarker,u=this.mouseDownX,l=this.mouseDownY,I=c.panKey&&a[c.panKey+"Key"];w&&w.touch||(d<h?d=h:d>h+n&&(d=h+n),e<k?e=k:e>k+p&&(e=k+p),this.hasDragged=Math.sqrt(Math.pow(u-d,2)+Math.pow(l-e,2)),10<this.hasDragged&&(y=b.isInsidePlot(u-h,l-k),b.hasCartesianSeries&&
(this.zoomX||this.zoomY)&&y&&!I&&!w&&(this.selectionMarker=w=b.renderer.rect(h,k,f?1:n,g?1:p,0).attr({fill:c.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add()),w&&f&&(d-=u,w.attr({width:ca(d),x:(0<d?0:d)+u})),w&&g&&(d=e-l,w.attr({height:ca(d),y:(0<d?0:d)+l})),y&&!w&&c.panning&&b.pan(a,c.panning)))},drop:function(a){var b=this,c=this.chart,d=this.hasPinched;if(this.selectionMarker){var e={xAxis:[],yAxis:[],originalEvent:a.originalEvent||a},f=this.selectionMarker,g=f.attr?f.attr("x"):f.x,
h=f.attr?f.attr("y"):f.y,k=f.attr?f.attr("width"):f.width,n=f.attr?f.attr("height"):f.height,p;if(this.hasDragged||d)v(c.axes,function(c){if(c.zoomEnabled&&t(c.min)&&(d||b[{xAxis:"zoomX",yAxis:"zoomY"}[c.coll]])){var f=c.horiz,u="touchend"===a.type?c.minPixelPadding:0,l=c.toValue((f?g:h)+u),f=c.toValue((f?g+k:h+n)-u);e[c.coll].push({axis:c,min:U(l,f),max:H(l,f)});p=!0}}),p&&da(c,"selection",e,function(a){c.zoom(M(a,d?{animation:!1}:null))});this.selectionMarker=this.selectionMarker.destroy();d&&this.scaleGroups()}c&&
(A(c.container,{cursor:c._cursor}),c.cancelClick=10<this.hasDragged,c.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[])},onContainerMouseDown:function(a){a=this.normalize(a);a.preventDefault&&a.preventDefault();this.dragStart(a)},onDocumentMouseUp:function(a){pa[Ba]&&pa[Ba].pointer.drop(a)},onDocumentMouseMove:function(a){var b=this.chart,c=this.chartPosition;a=this.normalize(a,c);!c||this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)||
this.reset()},onContainerMouseLeave:function(){var a=pa[Ba];a&&(a.pointer.reset(),a.pointer.chartPosition=null)},onContainerMouseMove:function(a){var b=this.chart;Ba=b.index;a=this.normalize(a);a.returnValue=!1;"mousedown"===b.mouseIsDown&&this.drag(a);!this.inClass(a.target,"highcharts-tracker")&&!b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)||b.openMenu||this.runPointActions(a)},inClass:function(a,b){for(var c;a;){if(c=N(a,"class")){if(-1!==c.indexOf(b))return!0;if(-1!==c.indexOf("highcharts-container"))return!1}a=
a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries;a=a.relatedTarget||a.toElement;if(b&&!b.options.stickyTracking&&!this.inClass(a,"highcharts-tooltip")&&!this.inClass(a,"highcharts-series-"+b.index))b.onMouseOut()},onContainerClick:function(a){var b=this.chart,c=b.hoverPoint,d=b.plotLeft,e=b.plotTop;a=this.normalize(a);a.originalEvent=a;b.cancelClick||(c&&this.inClass(a.target,"highcharts-tracker")?(da(c.series,"click",M(a,{point:c})),b.hoverPoint&&c.firePointEvent("click",
a)):(M(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-d,a.chartY-e)&&da(b,"click",a)))},setDOMEvents:function(){var a=this,b=a.chart.container;b.onmousedown=function(b){a.onContainerMouseDown(b)};b.onmousemove=function(b){a.onContainerMouseMove(b)};b.onclick=function(b){a.onContainerClick(b)};ia(b,"mouseleave",a.onContainerMouseLeave);1===Pa&&ia(P,"mouseup",a.onDocumentMouseUp);Oa&&(b.ontouchstart=function(b){a.onContainerTouchStart(b)},b.ontouchmove=function(b){a.onContainerTouchMove(b)},1===
Pa&&ia(P,"touchend",a.onDocumentTouchEnd))},destroy:function(){var a;qa(this.chart.container,"mouseleave",this.onContainerMouseLeave);Pa||(qa(P,"mouseup",this.onDocumentMouseUp),qa(P,"touchend",this.onDocumentTouchEnd));clearInterval(this.tooltipTimeout);for(a in this)this[a]=null}};M(X.Pointer.prototype,{pinchTranslate:function(a,b,c,d,e,f){(this.zoomHor||this.pinchHor)&&this.pinchTranslateDirection(!0,a,b,c,d,e,f);(this.zoomVert||this.pinchVert)&&this.pinchTranslateDirection(!1,a,b,c,d,e,f)},pinchTranslateDirection:function(a,
b,c,d,e,f,g,h){var k=this.chart,n=a?"x":"y",p=a?"X":"Y",y="chart"+p,w=a?"width":"height",u=k["plot"+(a?"Left":"Top")],l,I,r=h||1,z=k.inverted,m=k.bounds[a?"h":"v"],q=1===b.length,t=b[0][y],v=c[0][y],K=!q&&b[1][y],D=!q&&c[1][y],G;c=function(){!q&&20<ca(t-K)&&(r=h||ca(v-D)/ca(t-K));I=(u-v)/r+t;l=k["plot"+(a?"Width":"Height")]/r};c();b=I;b<m.min?(b=m.min,G=!0):b+l>m.max&&(b=m.max-l,G=!0);G?(v-=.8*(v-g[n][0]),q||(D-=.8*(D-g[n][1])),c()):g[n]=[v,D];z||(f[n]=I-u,f[w]=l);f=z?1/r:r;e[w]=l;e[n]=b;d[z?a?"scaleY":
"scaleX":"scale"+p]=r;d["translate"+p]=f*u+(v-f*t)},pinch:function(a){var b=this,c=b.chart,d=b.pinchDown,e=a.touches,f=e.length,g=b.lastValidTouch,h=b.hasZoom,k=b.selectionMarker,n={},p=1===f&&(b.inClass(a.target,"highcharts-tracker")&&c.runTrackerClick||b.runChartClick),y={};1<f&&(b.initiated=!0);h&&b.initiated&&!p&&a.preventDefault();Ra(e,function(a){return b.normalize(a)});"touchstart"===a.type?(v(e,function(a,b){d[b]={chartX:a.chartX,chartY:a.chartY}}),g.x=[d[0].chartX,d[1]&&d[1].chartX],g.y=
[d[0].chartY,d[1]&&d[1].chartY],v(c.axes,function(a){if(a.zoomEnabled){var b=c.bounds[a.horiz?"h":"v"],d=a.minPixelPadding,e=a.toPixels(z(a.options.min,a.dataMin)),f=a.toPixels(z(a.options.max,a.dataMax)),g=U(e,f),e=H(e,f);b.min=U(a.pos,g-d);b.max=H(a.pos+a.len,e+d)}}),b.res=!0):d.length&&(k||(b.selectionMarker=k=M({destroy:sa,touch:!0},c.plotBox)),b.pinchTranslate(d,e,n,k,y,g),b.hasPinched=h,b.scaleGroups(n,y),!h&&b.followTouchMove&&1===f?this.runPointActions(b.normalize(a)):b.res&&(b.res=!1,this.reset(!1,
0)))},touch:function(a,b){var c=this.chart;Ba=c.index;1===a.touches.length?(a=this.normalize(a),c.isInsidePlot(a.chartX-c.plotLeft,a.chartY-c.plotTop)&&!c.openMenu?(b&&this.runPointActions(a),this.pinch(a)):b&&this.reset()):2===a.touches.length&&this.pinch(a)},onContainerTouchStart:function(a){this.touch(a,!0)},onContainerTouchMove:function(a){this.touch(a)},onDocumentTouchEnd:function(a){pa[Ba]&&pa[Ba].pointer.drop(a)}});var db=X.Legend=function(a,b){this.init(a,b)};db.prototype={init:function(a,
b){var c=this,d=b.itemStyle,e=b.itemMarginTop||0;this.options=b;b.enabled&&(c.itemStyle=d,c.itemHiddenStyle=x(d,b.itemHiddenStyle),c.itemMarginTop=e,c.padding=d=z(b.padding,8),c.initialItemX=d,c.initialItemY=d-5,c.maxItemWidth=0,c.chart=a,c.itemHeight=0,c.symbolWidth=z(b.symbolWidth,16),c.pages=[],c.render(),ia(c.chart,"endResize",function(){c.positionCheckboxes()}))},colorizeItem:function(a,b){var c=this.options,d=a.legendItem,e=a.legendLine,f=a.legendSymbol,g=this.itemHiddenStyle.color,c=b?c.itemStyle.color:
g,h=b?a.legendColor||a.color||"#CCC":g,g=a.options&&a.options.marker,k={fill:h},n;d&&d.css({fill:c,color:c});e&&e.attr({stroke:h});if(f){if(g&&f.isMarker)for(n in k.stroke=h,g=a.convertAttribs(g),g)d=g[n],d!==E&&(k[n]=d);f.attr(k)}},positionItem:function(a){var b=this.options,c=b.symbolPadding,b=!b.rtl,d=a._legendItemPos,e=d[0],d=d[1],f=a.checkbox;(a=a.legendGroup)&&a.element&&a.translate(b?e:this.legendWidth-e-2*c-4,d);f&&(f.x=e,f.y=d)},destroyItem:function(a){var b=a.checkbox;v(["legendItem","legendLine",
"legendSymbol","legendGroup"],function(b){a[b]&&(a[b]=a[b].destroy())});b&&fa(a.checkbox)},destroy:function(){var a=this.group,b=this.box;b&&(this.box=b.destroy());a&&(this.group=a.destroy())},positionCheckboxes:function(a){var b=this.group.alignAttr,c,d=this.clipHeight||this.legendHeight;b&&(c=b.translateY,v(this.allItems,function(e){var f=e.checkbox,g;f&&(g=c+f.y+(a||0)+3,A(f,{left:b.translateX+e.checkboxOffset+f.x-20+"px",top:g+"px",display:g>c-6&&g<c+d-6?"":"none"}))}))},renderTitle:function(){var a=
this.padding,b=this.options.title,c=0;b.text&&(this.title||(this.title=this.chart.renderer.label(b.text,a-3,a-4,null,null,null,null,null,"legend-title").attr({zIndex:1}).css(b.style).add(this.group)),a=this.title.getBBox(),c=a.height,this.offsetWidth=a.width,this.contentGroup.attr({translateY:c}));this.titleHeight=c},setText:function(a){var b=this.options;a.legendItem.attr({text:b.labelFormat?G(b.labelFormat,a):b.labelFormatter.call(a)})},renderItem:function(a){var b=this.chart,c=b.renderer,d=this.options,
e="horizontal"===d.layout,f=this.symbolWidth,g=d.symbolPadding,h=this.itemStyle,k=this.itemHiddenStyle,n=this.padding,p=e?z(d.itemDistance,20):0,y=!d.rtl,w=d.width,u=d.itemMarginBottom||0,l=this.itemMarginTop,r=this.initialItemX,m=a.legendItem,q=a.series&&a.series.drawLegendSymbol?a.series:a,t=q.options,t=this.createCheckboxForItem&&t&&t.showCheckbox,v=d.useHTML;m||(a.legendGroup=c.g("legend-item").attr({zIndex:1}).add(this.scrollGroup),a.legendItem=m=c.text("",y?f+g:-g,this.baseline||0,v).css(x(a.visible?
h:k)).attr({align:y?"left":"right",zIndex:2}).add(a.legendGroup),this.baseline||(this.fontMetrics=c.fontMetrics(h.fontSize,m),this.baseline=this.fontMetrics.f+3+l,m.attr("y",this.baseline)),q.drawLegendSymbol(this,a),this.setItemEvents&&this.setItemEvents(a,m,v,h,k),this.colorizeItem(a,a.visible),t&&this.createCheckboxForItem(a));this.setText(a);c=m.getBBox();f=a.checkboxOffset=d.itemWidth||a.legendItemWidth||f+g+c.width+p+(t?20:0);this.itemHeight=g=O(a.legendItemHeight||c.height);e&&this.itemX-r+
f>(w||b.chartWidth-2*n-r-d.x)&&(this.itemX=r,this.itemY+=l+this.lastLineHeight+u,this.lastLineHeight=0);this.maxItemWidth=H(this.maxItemWidth,f);this.lastItemY=l+this.itemY+u;this.lastLineHeight=H(g,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];e?this.itemX+=f:(this.itemY+=l+g+u,this.lastLineHeight=g);this.offsetWidth=w||H((e?this.itemX-r-p:f)+n,this.offsetWidth)},getAllItems:function(){var a=[];v(this.chart.series,function(b){var c=b.options;z(c.showInLegend,t(c.linkedTo)?!1:E,!0)&&
(a=a.concat(b.legendItems||("point"===c.legendType?b.data:b)))});return a},adjustMargins:function(a,b){var c=this.chart,d=this.options,e=d.align.charAt(0)+d.verticalAlign.charAt(0)+d.layout.charAt(0);this.display&&!d.floating&&v([/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,/(lbv|lm|ltv)/],function(f,g){f.test(e)&&!t(a[g])&&(c[Wa[g]]=H(c[Wa[g]],c.legend[(g+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][g]*d[g%2?"x":"y"]+z(d.margin,12)+b[g]))})},render:function(){var a=this,b=a.chart,c=b.renderer,
d=a.group,e,f,g,h,k=a.box,n=a.options,p=a.padding,y=n.borderWidth,w=n.backgroundColor;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=0;d||(a.group=d=c.g("legend").attr({zIndex:7}).add(),a.contentGroup=c.g().attr({zIndex:1}).add(d),a.scrollGroup=c.g().add(a.contentGroup));a.renderTitle();e=a.getAllItems();l(e,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});n.reversed&&e.reverse();a.allItems=e;a.display=f=!!e.length;a.lastLineHeight=
0;v(e,function(b){a.renderItem(b)});g=(n.width||a.offsetWidth)+p;h=a.lastItemY+a.lastLineHeight+a.titleHeight;h=a.handleOverflow(h);h+=p;if(y||w)k?0<g&&0<h&&(k[k.isNew?"attr":"animate"](k.crisp({width:g,height:h})),k.isNew=!1):(a.box=k=c.rect(0,0,g,h,n.borderRadius,y||0).attr({stroke:n.borderColor,"stroke-width":y||0,fill:w||"none"}).add(d).shadow(n.shadow),k.isNew=!0),k[f?"show":"hide"]();a.legendWidth=g;a.legendHeight=h;v(e,function(b){a.positionItem(b)});f&&d.align(M({width:g,height:h},n),!0,"spacingBox");
b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,c=this.chart,d=c.renderer,e=this.options,f=e.y,f=c.spacingBox.height+("top"===e.verticalAlign?-f:f)-this.padding,g=e.maxHeight,h,k=this.clipRect,n=e.navigation,p=z(n.animation,!0),y=n.arrowSize||12,w=this.nav,u=this.pages,l=this.padding,r,m=this.allItems,q=function(a){k.attr({height:a});b.contentGroup.div&&(b.contentGroup.div.style.clip="rect("+l+"px,9999px,"+(l+a)+"px,0)")};"horizontal"===e.layout&&(f/=2);g&&(f=U(f,g));
u.length=0;a>f?(this.clipHeight=h=H(f-20-this.titleHeight-l,0),this.currentPage=z(this.currentPage,1),this.fullHeight=a,v(m,function(a,b){var c=a._legendItemPos[1],d=O(a.legendItem.getBBox().height),e=u.length;if(!e||c-u[e-1]>h&&(r||c)!==u[e-1])u.push(r||c),e++;b===m.length-1&&c+d-u[e-1]>h&&u.push(c);c!==r&&(r=c)}),k||(k=b.clipRect=d.clipRect(0,l,9999,0),b.contentGroup.clip(k)),q(h),w||(this.nav=w=d.g().attr({zIndex:1}).add(this.group),this.up=d.symbol("triangle",0,0,y,y).on("click",function(){b.scroll(-1,
p)}).add(w),this.pager=d.text("",15,10).css(n.style).add(w),this.down=d.symbol("triangle-down",0,0,y,y).on("click",function(){b.scroll(1,p)}).add(w)),b.scroll(0),a=f):w&&(q(c.chartHeight),w.hide(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0);return a},scroll:function(a,b){var c=this.pages,d=c.length,e=this.currentPage+a,f=this.clipHeight,g=this.options.navigation,h=g.activeColor,g=g.inactiveColor,k=this.pager,n=this.padding;e>d&&(e=d);0<e&&(b!==E&&Ja(b,this.chart),this.nav.attr({translateX:n,
translateY:f+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({fill:1===e?g:h}).css({cursor:1===e?"default":"pointer"}),k.attr({text:e+"/"+d}),this.down.attr({x:18+this.pager.getBBox().width,fill:e===d?g:h}).css({cursor:e===d?"default":"pointer"}),c=-c[e-1]+this.initialItemY,this.scrollGroup.animate({translateY:c}),this.currentPage=e,this.positionCheckboxes(c))}};var pb=X.LegendSymbolMixin={drawRectangle:function(a,b){var c=a.options.symbolHeight||a.fontMetrics.f;b.legendSymbol=
this.chart.renderer.rect(0,a.baseline-c+1,a.symbolWidth,c,a.options.symbolRadius||0).attr({zIndex:3}).add(b.legendGroup)},drawLineMarker:function(a){var b=this.options,c=b.marker,d;d=a.symbolWidth;var e=this.chart.renderer,f=this.legendGroup;a=a.baseline-O(.3*a.fontMetrics.b);var g;b.lineWidth&&(g={"stroke-width":b.lineWidth},b.dashStyle&&(g.dashstyle=b.dashStyle),this.legendLine=e.path(["M",0,a,"L",d,a]).attr(g).add(f));c&&!1!==c.enabled&&(b=c.radius,this.legendSymbol=d=e.symbol(this.symbol,d/2-
b,a-b,2*b,2*b).add(f),d.isMarker=!0)}};(/Trident\/7\.0/.test(Ca)||Na)&&Bb(db.prototype,"positionItem",function(a,b){var c=this,d=function(){b._legendItemPos&&a.call(c,b)};d();setTimeout(d)});var eb=X.Chart=function(){this.init.apply(this,arguments)};eb.prototype={callbacks:[],init:function(a,b){var c,d=a.series;a.series=null;c=x(ka,a);c.series=a.series=d;this.userOptions=a;d=c.chart;this.margin=this.splashArray("margin",d);this.spacing=this.splashArray("spacing",d);var e=d.events;this.bounds={h:{},
v:{}};this.callback=b;this.isResizing=0;this.options=c;this.axes=[];this.series=[];this.hasCartesianSeries=d.showAxes;var f=this,g;f.index=pa.length;pa.push(f);Pa++;!1!==d.reflow&&ia(f,"load",function(){f.initReflow()});if(e)for(g in e)ia(f,g,e[g]);f.xAxis=[];f.yAxis=[];f.animation=va?!1:z(d.animation,!0);f.pointCount=f.colorCounter=f.symbolCounter=0;f.firstRender()},initSeries:function(a){var b=this.options.chart;(b=W[a.type||b.type||b.defaultSeriesType])||ba(17,!0);b=new b;b.init(this,a);return b},
isInsidePlot:function(a,b,c){var d=c?b:a;a=c?a:b;return 0<=d&&d<=this.plotWidth&&0<=a&&a<=this.plotHeight},redraw:function(a){var b=this.axes,c=this.series,d=this.pointer,e=this.legend,f=this.isDirtyLegend,g,h,k=this.hasCartesianSeries,n=this.isDirtyBox,p=c.length,y=p,w=this.renderer,u=w.isHidden(),l=[];Ja(a,this);u&&this.cloneRenderTo();for(this.layOutTitles();y--;)if(a=c[y],a.options.stacking&&(g=!0,a.isDirty)){h=!0;break}if(h)for(y=p;y--;)a=c[y],a.options.stacking&&(a.isDirty=!0);v(c,function(a){a.isDirty&&
"point"===a.options.legendType&&(a.updateTotals&&a.updateTotals(),f=!0)});f&&e.options.enabled&&(e.render(),this.isDirtyLegend=!1);g&&this.getStacks();k&&!this.isResizing&&(this.maxTicks=null,v(b,function(a){a.setScale()}));this.getMargins();k&&(v(b,function(a){a.isDirty&&(n=!0)}),v(b,function(a){var b=a.min+","+a.max;a.extKey!==b&&(a.extKey=b,l.push(function(){da(a,"afterSetExtremes",M(a.eventArgs,a.getExtremes()));delete a.eventArgs}));(n||g)&&a.redraw()}));n&&this.drawChartBox();v(c,function(a){a.isDirty&&
a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});d&&d.reset(!0);w.draw();da(this,"redraw");u&&this.cloneRenderTo(!0);v(l,function(a){a.call()})},get:function(a){var b=this.axes,c=this.series,d,e;for(d=0;d<b.length;d++)if(b[d].options.id===a)return b[d];for(d=0;d<c.length;d++)if(c[d].options.id===a)return c[d];for(d=0;d<c.length;d++)for(e=c[d].points||[],b=0;b<e.length;b++)if(e[b].id===a)return e[b];return null},getAxes:function(){var a=this,b=this.options,c=b.xAxis=B(b.xAxis||{}),b=b.yAxis=B(b.yAxis||
{});v(c,function(a,b){a.index=b;a.isX=!0});v(b,function(a,b){a.index=b});c=c.concat(b);v(c,function(b){new wa(a,b)})},getSelectedPoints:function(){var a=[];v(this.series,function(b){a=a.concat(Za(b.points||[],function(a){return a.selected}))});return a},getSelectedSeries:function(){return Za(this.series,function(a){return a.selected})},setTitle:function(a,b,c){var d=this,e=d.options,f;f=e.title=x(e.title,a);e=e.subtitle=x(e.subtitle,b);v([["title",a,f],["subtitle",b,e]],function(a){var b=a[0],c=d[b],
e=a[1];a=a[2];c&&e&&(d[b]=c=c.destroy());a&&a.text&&!c&&(d[b]=d.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":"highcharts-"+b,zIndex:a.zIndex||4}).css(a.style).add())});d.layOutTitles(c)},layOutTitles:function(a){var b=0,c=this.title,d=this.subtitle,e=this.options,f=e.title,e=e.subtitle,g=this.renderer,h=this.spacingBox.width-44;c&&(c.css({width:(f.width||h)+"px"}).align(M({y:g.fontMetrics(f.style.fontSize,c).b-3},f),!1,"spacingBox"),f.floating||f.verticalAlign||(b=c.getBBox().height));
d&&(d.css({width:(e.width||h)+"px"}).align(M({y:b+(f.margin-13)+g.fontMetrics(e.style.fontSize,c).b},e),!1,"spacingBox"),e.floating||e.verticalAlign||(b=xa(b+d.getBBox().height)));c=this.titleOffset!==b;this.titleOffset=b;!this.isDirtyBox&&c&&(this.isDirtyBox=c,this.hasRendered&&z(a,!0)&&this.isDirtyBox&&this.redraw())},getChartSize:function(){var a=this.options.chart,b=a.width,a=a.height,c=this.renderToClone||this.renderTo;t(b)||(this.containerWidth=Ya(c,"width"));t(a)||(this.containerHeight=Ya(c,
"height"));this.chartWidth=H(0,b||this.containerWidth||600);this.chartHeight=H(0,z(a,19<this.containerHeight?this.containerHeight:400))},cloneRenderTo:function(a){var b=this.renderToClone,c=this.container;a?b&&(this.renderTo.appendChild(c),fa(b),delete this.renderToClone):(c&&c.parentNode===this.renderTo&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),A(b,{position:"absolute",top:"-9999px",display:"block"}),b.style.setProperty&&b.style.setProperty("display","block","important"),
P.body.appendChild(b),c&&b.appendChild(c))},getContainer:function(){var a,b=this.options,c=b.chart,d,e,f;this.renderTo=a=c.renderTo;f="highcharts-"+nb++;ja(a)&&(this.renderTo=a=P.getElementById(a));a||ba(13,!0);d=J(N(a,"data-highcharts-chart"));!isNaN(d)&&pa[d]&&pa[d].hasRendered&&pa[d].destroy();N(a,"data-highcharts-chart",this.index);a.innerHTML="";c.skipClone||a.offsetWidth||this.cloneRenderTo();this.getChartSize();d=this.chartWidth;e=this.chartHeight;this.container=a=F("div",{className:"highcharts-container"+
(c.className?" "+c.className:""),id:f},M({position:"relative",overflow:"hidden",width:d+"px",height:e+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},c.style),this.renderToClone||a);this._cursor=a.style.cursor;this.renderer=new (X[c.renderer]||bb)(a,d,e,c.style,c.forExport,b.exporting&&b.exporting.allowHTML);va&&this.renderer.create(this,a,d,e);this.renderer.chartIndex=this.index},getMargins:function(a){var b=this.spacing,c=this.margin,d=this.titleOffset;
this.resetMargins();d&&!t(c[0])&&(this.plotTop=H(this.plotTop,d+this.options.title.margin+b[0]));this.legend.adjustMargins(c,b);this.extraBottomMargin&&(this.marginBottom+=this.extraBottomMargin);this.extraTopMargin&&(this.plotTop+=this.extraTopMargin);a||this.getAxisMargins()},getAxisMargins:function(){var a=this,b=a.axisOffset=[0,0,0,0],c=a.margin;a.hasCartesianSeries&&v(a.axes,function(a){a.visible&&a.getOffset()});v(Wa,function(d,e){t(c[e])||(a[d]+=b[e])});a.setChartSize()},reflow:function(a){var b=
this,c=b.options.chart,d=b.renderTo,e=c.width||Ya(d,"width"),f=c.height||Ya(d,"height"),c=a?a.target:la,d=function(){b.container&&(b.setSize(e,f,!1),b.hasUserSize=null)};if(!b.hasUserSize&&!b.isPrinting&&e&&f&&(c===la||c===P)){if(e!==b.containerWidth||f!==b.containerHeight)clearTimeout(b.reflowTimeout),a?b.reflowTimeout=setTimeout(d,100):d();b.containerWidth=e;b.containerHeight=f}},initReflow:function(){var a=this,b=function(b){a.reflow(b)};ia(la,"resize",b);ia(a,"destroy",function(){qa(la,"resize",
b)})},setSize:function(a,b,c){var d=this,e,f,g,h=d.renderer;d.isResizing+=1;g=function(){d&&da(d,"endResize",null,function(){--d.isResizing})};Ja(c,d);d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;t(a)&&(d.chartWidth=e=H(0,O(a)),d.hasUserSize=!!e);t(b)&&(d.chartHeight=f=H(0,O(b)));a=h.globalAnimation;(a?$a:A)(d.container,{width:e+"px",height:f+"px"},a);d.setChartSize(!0);h.setSize(e,f,c);d.maxTicks=null;v(d.axes,function(a){a.isDirty=!0;a.setScale()});v(d.series,function(a){a.isDirty=
!0});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.layOutTitles();d.getMargins();d.redraw(c);d.oldChartHeight=null;da(d,"resize");a=h.globalAnimation;!1===a?g():setTimeout(g,a&&a.duration||500)},setChartSize:function(a){var b=this.inverted,c=this.renderer,d=this.chartWidth,e=this.chartHeight,f=this.options.chart,g=this.spacing,h=this.clipOffset,k,n,p,y;this.plotLeft=k=O(this.plotLeft);this.plotTop=n=O(this.plotTop);this.plotWidth=p=H(0,O(d-k-this.marginRight));this.plotHeight=y=H(0,O(e-n-this.marginBottom));
this.plotSizeX=b?y:p;this.plotSizeY=b?p:y;this.plotBorderWidth=f.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:g[3],y:g[0],width:d-g[3]-g[1],height:e-g[0]-g[2]};this.plotBox=c.plotBox={x:k,y:n,width:p,height:y};d=2*Y(this.plotBorderWidth/2);b=xa(H(d,h[3])/2);c=xa(H(d,h[0])/2);this.clipBox={x:b,y:c,width:Y(this.plotSizeX-H(d,h[1])/2-b),height:H(0,Y(this.plotSizeY-H(d,h[2])/2-c))};a||v(this.axes,function(a){a.setAxisSize();a.setAxisTranslation()})},resetMargins:function(){var a=this;v(Wa,function(b,
c){a[b]=z(a.margin[c],a.spacing[c])});a.axisOffset=[0,0,0,0];a.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=this.chartWidth,d=this.chartHeight,e=this.chartBackground,f=this.plotBackground,g=this.plotBorder,h=this.plotBGImage,k=a.borderWidth||0,n=a.backgroundColor,p=a.plotBackgroundColor,y=a.plotBackgroundImage,w=a.plotBorderWidth||0,u,l=this.plotLeft,r=this.plotTop,m=this.plotWidth,z=this.plotHeight,q=this.plotBox,t=this.clipRect,v=this.clipBox;u=k+(a.shadow?
8:0);if(k||n)e?e.animate(e.crisp({width:c-u,height:d-u})):(e={fill:n||"none"},k&&(e.stroke=a.borderColor,e["stroke-width"]=k),this.chartBackground=b.rect(u/2,u/2,c-u,d-u,a.borderRadius,k).attr(e).addClass("highcharts-background").add().shadow(a.shadow));p&&(f?f.animate(q):this.plotBackground=b.rect(l,r,m,z,0).attr({fill:p}).add().shadow(a.plotShadow));y&&(h?h.animate(q):this.plotBGImage=b.image(y,l,r,m,z).add());t?t.animate({width:v.width,height:v.height}):this.clipRect=b.clipRect(v);w&&(g?g.animate(g.crisp({x:l,
y:r,width:m,height:z,strokeWidth:-w})):this.plotBorder=b.rect(l,r,m,z,0,-w).attr({stroke:a.plotBorderColor,"stroke-width":w,fill:"none",zIndex:1}).add());this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,d=a.options.series,e,f;v(["inverted","angular","polar"],function(g){c=W[b.type||b.defaultSeriesType];f=a[g]||b[g]||c&&c.prototype[g];for(e=d&&d.length;!f&&e--;)(c=W[d[e].type])&&c.prototype[g]&&(f=!0);a[g]=f})},linkSeries:function(){var a=this,b=a.series;v(b,function(a){a.linkedSeries.length=
0});v(b,function(b){var d=b.options.linkedTo;ja(d)&&(d=":previous"===d?a.series[b.index-1]:a.get(d))&&(d.linkedSeries.push(b),b.linkedParent=d,b.visible=z(b.options.visible,d.options.visible,b.visible))})},renderSeries:function(){v(this.series,function(a){a.translate();a.render()})},renderLabels:function(){var a=this,b=a.options.labels;b.items&&v(b.items,function(c){var d=M(b.style,c.style),e=J(d.left)+a.plotLeft,f=J(d.top)+a.plotTop+12;delete d.left;delete d.top;a.renderer.text(c.html,e,f).attr({zIndex:2}).css(d).add()})},
render:function(){var a=this.axes,b=this.renderer,c=this.options,d,e,f,g;this.setTitle();this.legend=new db(this,c.legend);this.getStacks&&this.getStacks();this.getMargins(!0);this.setChartSize();d=this.plotWidth;e=this.plotHeight-=13;v(a,function(a){a.setScale()});this.getAxisMargins();f=1.1<d/this.plotWidth;g=1.1<e/this.plotHeight;if(f||g)this.maxTicks=null,v(a,function(a){(a.horiz&&f||!a.horiz&&g)&&a.setTickInterval(!0)}),this.getMargins();this.drawChartBox();this.hasCartesianSeries&&v(a,function(a){a.visible&&
a.render()});this.seriesGroup||(this.seriesGroup=b.g("series-group").attr({zIndex:3}).add());this.renderSeries();this.renderLabels();this.showCredits(c.credits);this.hasRendered=!0},showCredits:function(a){a.enabled&&!this.credits&&(this.credits=this.renderer.text(a.text,0,0).on("click",function(){a.href&&(location.href=a.href)}).attr({align:a.position.align,zIndex:8}).css(a.style).add().align(a.position))},destroy:function(){var a=this,b=a.axes,c=a.series,d=a.container,e,f=d&&d.parentNode;da(a,"destroy");
pa[a.index]=E;Pa--;a.renderTo.removeAttribute("data-highcharts-chart");qa(a);for(e=b.length;e--;)b[e]=b[e].destroy();for(e=c.length;e--;)c[e]=c[e].destroy();v("title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer scroller rangeSelector legend resetZoomButton tooltip renderer".split(" "),function(b){var c=a[b];c&&c.destroy&&(a[b]=c.destroy())});d&&(d.innerHTML="",qa(d),f&&fa(d));for(e in a)delete a[e]},isReadyToRender:function(){var a=this;return!ra&&
la==la.top&&"complete"!==P.readyState||va&&!la.canvg?(va?CanVGController.push(function(){a.firstRender()},a.options.global.canvasToolsURL):P.attachEvent("onreadystatechange",function(){P.detachEvent("onreadystatechange",a.firstRender);"complete"===P.readyState&&a.firstRender()}),!1):!0},firstRender:function(){var a=this,b=a.options,c=a.callback;a.isReadyToRender()&&(a.getContainer(),da(a,"init"),a.resetMargins(),a.setChartSize(),a.propFromSeries(),a.getAxes(),v(b.series||[],function(b){a.initSeries(b)}),
a.linkSeries(),da(a,"beforeRender"),X.Pointer&&(a.pointer=new Eb(a,b)),a.render(),a.renderer.draw(),c&&c.apply(a,[a]),v(a.callbacks,function(b){a.index!==E&&b.apply(a,[a])}),da(a,"load"),a.cloneRenderTo(!0))},splashArray:function(a,b){var c=b[a],c=ga(c)?c:[c,c,c,c];return[z(b[a+"Top"],c[0]),z(b[a+"Right"],c[1]),z(b[a+"Bottom"],c[2]),z(b[a+"Left"],c[3])]}};var Ia=function(){};Ia.prototype={init:function(a,b,c){this.series=a;this.color=a.color;this.applyOptions(b,c);this.pointAttr={};a.options.colorByPoint&&
(b=a.options.colors||a.chart.options.colors,this.color=this.color||b[a.colorCounter++],a.colorCounter===b.length&&(a.colorCounter=0));a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=c.options.pointValKey||c.pointValKey;a=Ia.prototype.optionsToObject.call(this,a);M(this,a);this.options=this.options?M(this.options,a):a;d&&(this.y=this[d]);this.x===E&&c&&(this.x=b===E?c.autoIncrement():b);return this},optionsToObject:function(a){var b={},c=this.series,d=c.options.keys,
e=d||c.pointArrayMap||["y"],f=e.length,g=0,h=0;if("number"===typeof a||null===a)b[e[0]]=a;else if(aa(a))for(!d&&a.length>f&&(c=typeof a[0],"string"===c?b.name=a[0]:"number"===c&&(b.x=a[0]),g++);h<f;)d&&void 0===a[g]||(b[e[h]]=a[g]),g++,h++;else"object"===typeof a&&(b=a,a.dataLabels&&(c._hasPointLabels=!0),a.marker&&(c._hasPointMarkers=!0));return b},destroy:function(){var a=this.series.chart,b=a.hoverPoints,c;a.pointCount--;b&&(this.setState(),q(b,this),b.length||(a.hoverPoints=null));if(this===a.hoverPoint)this.onMouseOut();
if(this.graphic||this.dataLabel)qa(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(c in this)this[c]=null},destroyElements:function(){for(var a=["graphic","dataLabel","dataLabelUpper","connector","shadowGroup"],b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,color:this.color,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}},tooltipFormatter:function(a){var b=
this.series,c=b.tooltipOptions,d=z(c.valueDecimals,""),e=c.valuePrefix||"",f=c.valueSuffix||"";v(b.pointArrayMap||["y"],function(b){b="{point."+b;if(e||f)a=a.replace(b+"}",e+b+"}"+f);a=a.replace(b+"}",b+":,."+d+"f}")});return G(a,{point:this,series:this.series})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&this.importEvents();"click"===a&&e.allowPointSelect&&(c=function(a){d.select&&d.select(null,a.ctrlKey||
a.metaKey||a.shiftKey)});da(this,a,b,c)},visible:!0};var ea=X.Series=function(){};ea.prototype={isCartesian:!0,type:"line",pointClass:Ia,sorted:!0,requireSorting:!0,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},directTouch:!1,axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x","y"],init:function(a,b){var c=this,d,e,f=a.series,g=function(a,b){return z(a.options.index,a._i)-z(b.options.index,b._i)};c.chart=a;c.options=b=c.setOptions(b);c.linkedSeries=
[];c.bindAxes();M(c,{name:b.name,state:"",pointAttr:{},visible:!1!==b.visible,selected:!0===b.selected});va&&(b.animation=!1);e=b.events;for(d in e)ia(c,d,e[d]);if(e&&e.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;c.getColor();c.getSymbol();v(c.parallelArrays,function(a){c[a+"Data"]=[]});c.setData(b.data,!1);c.isCartesian&&(a.hasCartesianSeries=!0);f.push(c);c._i=f.length-1;l(f,g);this.yAxis&&l(this.yAxis.series,g);v(f,function(a,b){a.index=b;a.name=
a.name||"Series "+(b+1)})},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;v(a.axisTypes||[],function(e){v(c[e],function(c){d=c.options;if(b[e]===d.index||b[e]!==E&&b[e]===d.id||b[e]===E&&0===d.index)c.series.push(a),a[e]=c,c.isDirty=!0});a[e]||a.optionalAxis===e||ba(18,!0)})},updateParallelArrays:function(a,b){var c=a.series,d=arguments;v(c.parallelArrays,"number"===typeof b?function(d){var f="y"===d&&c.toYData?c.toYData(a):a[d];c[d+"Data"][b]=f}:function(a){Array.prototype[b].apply(c[a+"Data"],
Array.prototype.slice.call(d,2))})},autoIncrement:function(){var a=this.options,b=this.xIncrement,c,d=a.pointIntervalUnit,b=z(b,a.pointStart,0);this.pointInterval=c=z(this.pointInterval,a.pointInterval,1);if("month"===d||"year"===d)a=new za(b),a="month"===d?+a[lb](a[La]()+c):+a[mb](a[Ma]()+c),c=a-b;this.xIncrement=b+c;return b},getSegments:function(){var a=-1,b=[],c,d=this.points,e=d.length;if(e)if(this.options.connectNulls){for(c=e;c--;)null===d[c].y&&d.splice(c,1);d.length&&(b=[d])}else v(d,function(c,
g){null===c.y?(g>a+1&&b.push(d.slice(a+1,g)),a=g):g===e-1&&b.push(d.slice(a+1,g+1))});this.segments=b},setOptions:function(a){var b=this.chart,c=b.options.plotOptions,b=b.userOptions||{},d=b.plotOptions||{},e=c[this.type];this.userOptions=a;c=x(e,c.series,a);this.tooltipOptions=x(ka.tooltip,ka.plotOptions[this.type].tooltip,b.tooltip,d.series&&d.series.tooltip,d[this.type]&&d[this.type].tooltip,a.tooltip);null===e.marker&&delete c.marker;this.zoneAxis=c.zoneAxis;a=this.zones=(c.zones||[]).slice();
!c.negativeColor&&!c.negativeFillColor||c.zones||a.push({value:c[this.zoneAxis+"Threshold"]||c.threshold||0,color:c.negativeColor,fillColor:c.negativeFillColor});a.length&&t(a[a.length-1].value)&&a.push({color:this.color,fillColor:this.fillColor});return c},getCyclic:function(a,b,c){var d=this.userOptions,e="_"+a+"Index",f=a+"Counter";b||(t(d[e])?b=d[e]:(d[e]=b=this.chart[f]%c.length,this.chart[f]+=1),b=c[b]);this[a]=b},getColor:function(){this.options.colorByPoint?this.options.color=null:this.getCyclic("color",
this.options.color||ma[this.type].color,this.chart.options.colors)},getSymbol:function(){var a=this.options.marker;this.getCyclic("symbol",a.symbol,this.chart.options.symbols);/^url/.test(this.symbol)&&(a.radius=0)},drawLegendSymbol:pb.drawLineMarker,setData:function(a,b,c,d){var e=this,f=e.points,g=f&&f.length||0,h,k=e.options,n=e.chart,p=null,y=e.xAxis,w=y&&!!y.categories,u=k.turboThreshold,l=this.xData,r=this.yData,m=(h=e.pointArrayMap)&&h.length;a=a||[];h=a.length;b=z(b,!0);if(!1!==d&&h&&g===
h&&!e.cropped&&!e.hasGroupedData&&e.visible)v(a,function(a,b){f[b].update&&f[b].update(a,!1,null,!1)});else{e.xIncrement=null;e.pointRange=w?1:k.pointRange;e.colorCounter=0;v(this.parallelArrays,function(a){e[a+"Data"].length=0});if(u&&h>u){for(c=0;null===p&&c<h;)p=a[c],c++;if(V(p)){w=z(k.pointStart,0);p=z(k.pointInterval,1);for(c=0;c<h;c++)l[c]=w,r[c]=a[c],w+=p;e.xIncrement=w}else if(aa(p))if(m)for(c=0;c<h;c++)p=a[c],l[c]=p[0],r[c]=p.slice(1,m+1);else for(c=0;c<h;c++)p=a[c],l[c]=p[0],r[c]=p[1];else ba(12)}else for(c=
0;c<h;c++)a[c]!==E&&(p={series:e},e.pointClass.prototype.applyOptions.apply(p,[a[c]]),e.updateParallelArrays(p,c),w&&t(p.name)&&(y.names[p.x]=p.name));ja(r[0])&&ba(14,!0);e.data=[];e.options.data=a;for(c=g;c--;)f[c]&&f[c].destroy&&f[c].destroy();y&&(y.minRange=y.userMinRange);e.isDirty=e.isDirtyData=n.isDirtyBox=!0;c=!1}"point"===k.legendType&&(this.processData(),this.generatePoints());b&&n.redraw(c)},processData:function(a){var b=this.xData,c=this.yData,d=b.length,e;e=0;var f,g,h=this.xAxis,k,n=
this.options;k=n.cropThreshold;var p=this.getExtremesFromAll||n.getExtremesFromAll,y=this.isCartesian,w,u;if(y&&!this.isDirty&&!h.isDirty&&!this.yAxis.isDirty&&!a)return!1;h&&(a=h.getExtremes(),w=a.min,u=a.max);if(y&&this.sorted&&!p&&(!k||d>k||this.forceCrop))if(b[d-1]<w||b[0]>u)b=[],c=[];else if(b[0]<w||b[d-1]>u)e=this.cropData(this.xData,this.yData,w,u),b=e.xData,c=e.yData,e=e.start,f=!0;for(k=b.length-1;0<=k;k--)d=b[k]-b[k-1],0<d&&(g===E||d<g)?g=d:0>d&&this.requireSorting&&ba(15);this.cropped=
f;this.cropStart=e;this.processedXData=b;this.processedYData=c;null===n.pointRange&&(this.pointRange=g||1);this.closestPointRange=g},cropData:function(a,b,c,d){var e=a.length,f=0,g=e,h=z(this.cropShoulder,1),k;for(k=0;k<e;k++)if(a[k]>=c){f=H(0,k-h);break}for(;k<e;k++)if(a[k]>d){g=k+h;break}return{xData:a.slice(f,g),yData:b.slice(f,g),start:f,end:g}},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,f=this.pointClass,g=d.length,h=this.cropStart||
0,k,n=this.hasGroupedData,p,y=[],w;b||n||(b=[],b.length=a.length,b=this.data=b);for(w=0;w<g;w++)k=h+w,n?y[w]=(new f).init(this,[d[w]].concat(B(e[w]))):(b[k]?p=b[k]:a[k]!==E&&(b[k]=p=(new f).init(this,a[k],d[w])),y[w]=p),y[w].index=k;if(b&&(g!==(c=b.length)||n))for(w=0;w<c;w++)w!==h||n||(w+=g),b[w]&&(b[w].destroyElements(),b[w].plotX=E);this.data=b;this.points=y},getExtremes:function(a){var b=this.yAxis,c=this.processedXData,d,e=[],f=0;d=this.xAxis.getExtremes();var g=d.min,h=d.max,k,n,p,y;a=a||this.stackedYData||
this.processedYData;d=a.length;for(y=0;y<d;y++)if(n=c[y],p=a[y],k=null!==p&&p!==E&&(!b.isLog||p.length||0<p),n=this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||(c[y+1]||n)>=g&&(c[y-1]||n)<=h,k&&n)if(k=p.length)for(;k--;)null!==p[k]&&(e[f++]=p[k]);else e[f++]=p;this.dataMin=K(e);this.dataMax=D(e)},translate:function(){this.processedXData||this.processData();this.generatePoints();for(var a=this.options,b=a.stacking,c=this.xAxis,d=c.categories,e=this.yAxis,f=this.points,g=f.length,
h=!!this.modifyValue,k=a.pointPlacement,n="between"===k||V(k),p=a.threshold,y=a.startFromThreshold?p:0,w,u,l,r,m=Number.MAX_VALUE,a=0;a<g;a++){var q=f[a],v=q.x,D=q.y;u=q.low;var K=b&&e.stacks[(this.negStacks&&D<(y?0:p)?"-":"")+this.stackKey];e.isLog&&null!==D&&0>=D&&(q.y=D=null,ba(10));q.plotX=w=U(H(-1E5,c.translate(v,0,0,0,1,k,"flags"===this.type)),1E5);b&&this.visible&&K&&K[v]&&(r=this.getStackIndicator(r,v,this.index),K=K[v],D=K.points[r.key],u=D[0],D=D[1],u===y&&(u=z(p,e.min)),e.isLog&&0>=u&&
(u=null),q.total=q.stackTotal=K.total,q.percentage=K.total&&q.y/K.total*100,q.stackY=D,K.setOffset(this.pointXOffset||0,this.barW||0));q.yBottom=t(u)?e.translate(u,0,1,0,1):null;h&&(D=this.modifyValue(D,q));q.plotY=u="number"===typeof D&&Infinity!==D?U(H(-1E5,e.translate(D,0,1,0,1)),1E5):E;q.isInside=u!==E&&0<=u&&u<=e.len&&0<=w&&w<=c.len;q.clientX=n?c.translate(v,0,0,0,1):w;q.negative=q.y<(p||0);q.category=d&&d[q.x]!==E?d[q.x]:q.x;a&&(m=U(m,ca(w-l)));l=w}this.closestPointRangePx=m;this.getSegments()},
setClip:function(a){var b=this.chart,c=this.options,d=b.renderer,e=b.inverted,f=this.clipBox,g=f||b.clipBox,h=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,g.height,c.xAxis,c.yAxis].join(),k=b[h],n=b[h+"m"];k||(a&&(g.width=0,b[h+"m"]=n=d.clipRect(-99,e?-b.plotLeft:-b.plotTop,99,e?b.chartWidth:b.chartHeight)),b[h]=k=d.clipRect(g));a&&(k.count+=1);!1!==c.clip&&(this.group.clip(a||f?k:b.clipRect),this.markerGroup.clip(n),this.sharedClipKey=h);a||(--k.count,0>=k.count&&h&&b[h]&&(f||(b[h]=
b[h].destroy()),b[h+"m"]&&(b[h+"m"]=b[h+"m"].destroy())))},animate:function(a){var b=this.chart,c=this.options.animation,d;c&&!ga(c)&&(c=ma[this.type].animation);a?this.setClip(c):(d=this.sharedClipKey,(a=b[d])&&a.animate({width:b.plotSizeX},c),b[d+"m"]&&b[d+"m"].animate({width:b.plotSizeX+99},c),this.animate=null)},afterAnimate:function(){this.setClip();da(this,"afterAnimate")},drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,k,n,p,y=this.options.marker,w=this.pointAttr[""],u,l,r,
q=this.markerGroup,m=z(y.enabled,this.xAxis.isRadial,this.closestPointRangePx>2*y.radius);if(!1!==y.enabled||this._hasPointMarkers)for(f=b.length;f--;)g=b[f],d=Y(g.plotX),e=g.plotY,p=g.graphic,u=g.marker||{},l=!!g.marker,a=m&&u.enabled===E||u.enabled,r=g.isInside,a&&e!==E&&!isNaN(e)&&null!==g.y?(a=g.pointAttr[g.selected?"select":""]||w,h=a.r,k=z(u.symbol,this.symbol),n=0===k.indexOf("url"),p?p[r?"show":"hide"](!0).animate(M({x:d-h,y:e-h},p.symbolName?{width:2*h,height:2*h}:{})):r&&(0<h||n)&&(g.graphic=
c.renderer.symbol(k,d-h,e-h,2*h,2*h,l?u:y).attr(a).add(q))):p&&(g.graphic=p.destroy())},convertAttribs:function(a,b,c,d){var e=this.pointAttrToOptions,f,g,h={};a=a||{};b=b||{};c=c||{};d=d||{};for(f in e)g=e[f],h[f]=z(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=a.options,c=ma[a.type].marker?b.marker:b,d=c.states,e=d.hover,f,g=a.color,h=a.options.negativeColor;f={stroke:g,fill:g};var k=a.points||[],n,p,y=[],w=a.pointAttrToOptions;n=a.hasPointSpecificOptions;var u=c.lineColor,l=
c.fillColor;p=b.turboThreshold;var r=a.zones,q=a.zoneAxis||"y",m;b.marker?(e.radius=e.radius||c.radius+e.radiusPlus,e.lineWidth=e.lineWidth||c.lineWidth+e.lineWidthPlus):(e.color=e.color||Aa(e.color||g).brighten(e.brightness).get(),e.negativeColor=e.negativeColor||Aa(e.negativeColor||h).brighten(e.brightness).get());y[""]=a.convertAttribs(c,f);v(["hover","select"],function(b){y[b]=a.convertAttribs(d[b],y[""])});a.pointAttr=y;g=k.length;if(!p||g<p||n)for(;g--;){p=k[g];(c=p.options&&p.options.marker||
p.options)&&!1===c.enabled&&(c.radius=0);if(r.length){n=0;for(f=r[n];p[q]>=f.value;)f=r[++n];p.color=p.fillColor=z(f.color,a.color)}n=b.colorByPoint||p.color;if(p.options)for(m in w)t(c[w[m]])&&(n=!0);if(n){c=c||{};n=[];d=c.states||{};f=d.hover=d.hover||{};if(!b.marker||p.negative&&!f.fillColor&&!e.fillColor)f[a.pointAttrToOptions.fill]=f.color||!p.options.color&&e[p.negative&&h?"negativeColor":"color"]||Aa(p.color).brighten(f.brightness||e.brightness).get();f={color:p.color};l||(f.fillColor=p.color);
u||(f.lineColor=p.color);c.hasOwnProperty("color")&&!c.color&&delete c.color;n[""]=a.convertAttribs(M(f,c),y[""]);n.hover=a.convertAttribs(d.hover,y.hover,n[""]);n.select=a.convertAttribs(d.select,y.select,n[""])}else n=y;p.pointAttr=n}},destroy:function(){var a=this,b=a.chart,c=/AppleWebKit\/533/.test(Ca),d,e=a.data||[],f,g,h;da(a,"destroy");qa(a);v(a.axisTypes||[],function(b){if(h=a[b])q(h.series,a),h.isDirty=h.forceRedraw=!0});a.legendItem&&a.chart.legend.destroyItem(a);for(d=e.length;d--;)(f=
e[d])&&f.destroy&&f.destroy();a.points=null;clearTimeout(a.animationTimeout);for(g in a)a[g]instanceof S&&!a[g].survive&&(d=c&&"group"===g?"hide":"destroy",a[g][d]());b.hoverSeries===a&&(b.hoverSeries=null);q(b.series,a);for(g in a)delete a[g]},getSegmentPath:function(a){var b=this,c=[],d=b.options.step;v(a,function(e,f){var g=e.plotX,h=e.plotY,k;b.getPointSpline?c.push.apply(c,b.getPointSpline(a,e,f)):(c.push(f?"L":"M"),d&&f&&(k=a[f-1],"right"===d?c.push(k.plotX,h,"L"):"center"===d?c.push((k.plotX+
g)/2,k.plotY,"L",(k.plotX+g)/2,h,"L"):c.push(g,k.plotY,"L")),c.push(e.plotX,e.plotY))});return c},getGraphPath:function(){var a=this,b=[],c,d=[];v(a.segments,function(e){c=a.getSegmentPath(e);1<e.length?b=b.concat(c):d.push(e[0])});a.singlePoints=d;return a.graphPath=b},drawGraph:function(){var a=this,b=this.options,c=[["graph",b.lineColor||this.color,b.dashStyle]],d=b.lineWidth,e="square"!==b.linecap,f=this.getGraphPath(),g=this.fillGraph&&this.color||"none";v(this.zones,function(d,e){c.push(["zoneGraph"+
e,d.color||a.color,d.dashStyle||b.dashStyle])});v(c,function(c,k){var n=c[0],p=a[n];p?p.animate({d:f}):(d||g)&&f.length&&(p={stroke:c[1],"stroke-width":d,fill:g,zIndex:1},c[2]?p.dashstyle=c[2]:e&&(p["stroke-linecap"]=p["stroke-linejoin"]="round"),a[n]=a.chart.renderer.path(f).attr(p).add(a.group).shadow(2>k&&b.shadow))})},applyZones:function(){var a=this,b=this.chart,c=b.renderer,d=this.zones,e,f,g=this.clips||[],h,k=this.graph,n=this.area,p=H(b.chartWidth,b.chartHeight),y=this[(this.zoneAxis||"y")+
"Axis"],w,u=y.reversed,l=b.inverted,r=y.horiz,q,m,t,D=!1;d.length&&(k||n)&&y.min!==E&&(k&&k.hide(),n&&n.hide(),w=y.getExtremes(),v(d,function(d,v){e=u?r?b.plotWidth:0:r?0:y.toPixels(w.min);e=U(H(z(f,e),0),p);f=U(H(O(y.toPixels(z(d.value,w.max),!0)),0),p);D&&(e=f=y.toPixels(w.max));q=Math.abs(e-f);m=U(e,f);t=H(e,f);y.isXAxis?(h={x:l?t:m,y:0,width:q,height:p},r||(h.x=b.plotHeight-h.x)):(h={x:0,y:l?t:m,width:p,height:q},r&&(h.y=b.plotWidth-h.y));b.inverted&&c.isVML&&(h=y.isXAxis?{x:0,y:u?m:t,height:h.width,
width:b.chartWidth}:{x:h.y-b.plotLeft-b.spacingBox.x,y:0,width:h.height,height:b.chartHeight});g[v]?g[v].animate(h):(g[v]=c.clipRect(h),k&&a["zoneGraph"+v].clip(g[v]),n&&a["zoneArea"+v].clip(g[v]));D=d.value>w.max}),this.clips=g)},invertGroups:function(){function a(){var a={width:b.yAxis.len,height:b.xAxis.len};v(["group","markerGroup"],function(c){b[c]&&b[c].attr(a).invert()})}var b=this,c=b.chart;b.xAxis&&(ia(c,"resize",a),ia(b,"destroy",function(){qa(c,"resize",a)}),a(),b.invertGroups=a)},plotGroup:function(a,
b,c,d,e){var f=this[a],g=!f;g&&(this[a]=f=this.chart.renderer.g(b).attr({visibility:c,zIndex:d||.1}).add(e),f.addClass("highcharts-series-"+this.index));f[g?"attr":"animate"](this.getPlotBox());return f},getPlotBox:function(){var a=this.chart,b=this.xAxis,c=this.yAxis;a.inverted&&(b=c,c=this.xAxis);return{translateX:b?b.left:a.plotLeft,translateY:c?c.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,c,d=a.options,e=(c=d.animation)&&!!a.animate&&b.renderer.isSVG&&z(c.duration,
500)||0,f=a.visible?"visible":"hidden",g=d.zIndex,h=a.hasRendered,k=b.seriesGroup;c=a.plotGroup("group","series",f,g,k);a.markerGroup=a.plotGroup("markerGroup","markers",f,g,k);e&&a.animate(!0);a.getAttribs();c.inverted=a.isCartesian?b.inverted:!1;a.drawGraph&&(a.drawGraph(),a.applyZones());v(a.points,function(a){a.redraw&&a.redraw()});a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&!1!==a.options.enableMouseTracking&&a.drawTracker();b.inverted&&a.invertGroups();!1===
d.clip||a.sharedClipKey||h||c.clip(b.clipRect);e&&a.animate();h||(e?a.animationTimeout=setTimeout(function(){a.afterAnimate()},e):a.afterAnimate());a.isDirty=a.isDirtyData=!1;a.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirtyData,c=this.isDirty,d=this.group,e=this.xAxis,f=this.yAxis;d&&(a.inverted&&d.attr({width:a.plotWidth,height:a.plotHeight}),d.animate({translateX:z(e&&e.left,a.plotLeft),translateY:z(f&&f.top,a.plotTop)}));this.translate();this.render();b&&da(this,"updatedData");
(c||b)&&delete this.kdTree},kdDimensions:1,kdAxisArray:["clientX","plotY"],searchPoint:function(a,b){var c=this.xAxis,d=this.yAxis,e=this.chart.inverted;return this.searchKDTree({clientX:e?c.len-a.chartY+c.pos:a.chartX-c.pos,plotY:e?d.len-a.chartX+d.pos:a.chartY-d.pos},b)},buildKDTree:function(){function a(b,d,g){var h,k;if(k=b&&b.length)return h=c.kdAxisArray[d%g],b.sort(function(a,b){return a[h]-b[h]}),k=Math.floor(k/2),{point:b[k],left:a(b.slice(0,k),d+1,g),right:a(b.slice(k+1),d+1,g)}}function b(){var b=
Za(c.points||[],function(a){return null!==a.y});c.kdTree=a(b,d,d)}var c=this,d=c.kdDimensions;delete c.kdTree;c.options.kdSync?b():setTimeout(b)},searchKDTree:function(a,b){function c(a,b,n,p){var y=b.point,w=d.kdAxisArray[n%p],u,l,r=y;l=t(a[e])&&t(y[e])?Math.pow(a[e]-y[e],2):null;u=t(a[f])&&t(y[f])?Math.pow(a[f]-y[f],2):null;u=(l||0)+(u||0);y.dist=t(u)?Math.sqrt(u):Number.MAX_VALUE;y.distX=t(l)?Math.sqrt(l):Number.MAX_VALUE;w=a[w]-y[w];u=0>w?"left":"right";l=0>w?"right":"left";b[u]&&(u=c(a,b[u],
n+1,p),r=u[g]<r[g]?u:y);b[l]&&Math.sqrt(w*w)<r[g]&&(a=c(a,b[l],n+1,p),r=a[g]<r[g]?a:r);return r}var d=this,e=this.kdAxisArray[0],f=this.kdAxisArray[1],g=b?"distX":"dist";this.kdTree||this.buildKDTree();if(this.kdTree)return c(a,this.kdTree,this.kdDimensions,this.kdDimensions)}};wb.prototype={destroy:function(){ha(this,this.axis)},render:function(a){var b=this.options,c=b.format,c=c?G(c,this):b.formatter.call(this);this.label?this.label.attr({text:c,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(c,
null,null,b.useHTML).css(b.style).attr({align:this.textAlign,rotation:b.rotation,visibility:"hidden"}).add(a)},setOffset:function(a,b){var c=this.axis,d=c.chart,e=d.inverted,f=c.reversed,f=this.isNegative&&!f||!this.isNegative&&f,g=c.translate(c.usePercentage?100:this.total,0,0,0,1),c=c.translate(0),c=ca(g-c),h=d.xAxis[0].translate(this.x)+a,k=d.plotHeight,f={x:e?f?g:g-c:h,y:e?k-h-b:f?k-g-c:k-g,width:e?c:b,height:e?b:c};if(e=this.label)e.align(this.alignOptions,null,f),f=e.alignAttr,e[!1===this.options.crop||
d.isInsidePlot(f.x,f.y)?"show":"hide"](!0)}};eb.prototype.getStacks=function(){var a=this;v(a.yAxis,function(a){a.stacks&&a.hasVisibleSeries&&(a.oldStacks=a.stacks)});v(a.series,function(b){!b.options.stacking||!0!==b.visible&&!1!==a.options.chart.ignoreHiddenSeries||(b.stackKey=b.type+z(b.options.stack,""))})};wa.prototype.buildStacks=function(){var a=this.series,b=z(this.options.reversedStacks,!0),c=a.length;if(!this.isXAxis){for(this.usePercentage=!1;c--;)a[b?c:a.length-c-1].setStackedPoints();
if(this.usePercentage)for(c=0;c<a.length;c++)a[c].setPercentStacks()}};wa.prototype.renderStackTotals=function(){var a=this.chart,b=a.renderer,c=this.stacks,d,e,f=this.stackTotalGroup;f||(this.stackTotalGroup=f=b.g("stack-labels").attr({visibility:"visible",zIndex:6}).add());f.translate(a.plotLeft,a.plotTop);for(d in c)for(e in a=c[d],a)a[e].render(f)};wa.prototype.resetStacks=function(){var a=this.stacks,b,c;if(!this.isXAxis)for(b in a)for(c in a[b])a[b][c].touched<this.stacksTouched?(a[b][c].destroy(),
delete a[b][c]):(a[b][c].total=null,a[b][c].cum=0)};wa.prototype.cleanStacks=function(){var a,b,c;if(!this.isXAxis)for(b in this.oldStacks&&(a=this.stacks=this.oldStacks),a)for(c in a[b])a[b][c].cum=a[b][c].total};ea.prototype.setStackedPoints=function(){if(this.options.stacking&&(!0===this.visible||!1===this.chart.options.chart.ignoreHiddenSeries)){var a=this.processedXData,b=this.processedYData,c=[],d=b.length,e=this.options,f=e.threshold,g=e.startFromThreshold?f:0,h=e.stack,e=e.stacking,k=this.stackKey,
n="-"+k,p=this.negStacks,l=this.yAxis,w=l.stacks,u=l.oldStacks,r,q,m,v,t,D,K;l.stacksTouched+=1;for(t=0;t<d;t++)D=a[t],K=b[t],r=this.getStackIndicator(r,D,this.index),v=r.key,m=(q=p&&K<(g?0:f))?n:k,w[m]||(w[m]={}),w[m][D]||(u[m]&&u[m][D]?(w[m][D]=u[m][D],w[m][D].total=null):w[m][D]=new wb(l,l.options.stackLabels,q,D,h)),m=w[m][D],m.points[v]=[z(m.cum,g)],m.touched=l.stacksTouched,"percent"===e?(q=q?k:n,p&&w[q]&&w[q][D]?(q=w[q][D],m.total=q.total=H(q.total,m.total)+ca(K)||0):m.total=C(m.total+(ca(K)||
0))):m.total=C(m.total+(K||0)),m.cum=z(m.cum,g)+(K||0),m.points[v].push(m.cum),c[t]=m.cum;"percent"===e&&(l.usePercentage=!0);this.stackedYData=c;l.oldStacks={}}};ea.prototype.setPercentStacks=function(){var a=this,b=a.stackKey,c=a.yAxis.stacks,d=a.processedXData,e;v([b,"-"+b],function(b){for(var g=d.length,h,k;g--;)if(h=d[g],e=a.getStackIndicator(e,h,a.index),h=(k=c[b]&&c[b][h])&&k.points[e.key])k=k.total?100/k.total:0,h[0]=C(h[0]*k),h[1]=C(h[1]*k),a.stackedYData[g]=h[1]})};ea.prototype.getStackIndicator=
function(a,b,c){t(a)&&a.x===b?a.index++:a={x:b,index:0};a.key=[c,b,a.index].join();return a};M(eb.prototype,{addSeries:function(a,b,c){var d,e=this;a&&(b=z(b,!0),da(e,"addSeries",{options:a},function(){d=e.initSeries(a);e.isDirtyLegend=!0;e.linkSeries();b&&e.redraw(c)}));return d},addAxis:function(a,b,c,d){var e=b?"xAxis":"yAxis",f=this.options;new wa(this,x(a,{index:this[e].length,isX:b}));f[e]=B(f[e]||{});f[e].push(a);z(c,!0)&&this.redraw(d)},showLoading:function(a){var b=this,c=b.options,d=b.loadingDiv,
e=c.loading,f=function(){d&&A(d,{left:b.plotLeft+"px",top:b.plotTop+"px",width:b.plotWidth+"px",height:b.plotHeight+"px"})};d||(b.loadingDiv=d=F("div",{className:"highcharts-loading"},M(e.style,{zIndex:10,display:"none"}),b.container),b.loadingSpan=F("span",null,e.labelStyle,d),ia(b,"redraw",f));b.loadingSpan.innerHTML=a||c.lang.loading;b.loadingShown||(A(d,{opacity:0,display:""}),$a(d,{opacity:e.style.opacity},{duration:e.showDuration||0}),b.loadingShown=!0);f()},hideLoading:function(){var a=this.options,
b=this.loadingDiv;b&&$a(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){A(b,{display:"none"})}});this.loadingShown=!1}});M(Ia.prototype,{update:function(a,b,c,d){function e(){f.applyOptions(a);null===f.y&&h&&(f.graphic=h.destroy());ga(a)&&!aa(a)&&(f.redraw=function(){h&&h.element&&a&&a.marker&&a.marker.symbol&&(f.graphic=h.destroy());a&&a.dataLabels&&f.dataLabel&&(f.dataLabel=f.dataLabel.destroy());f.redraw=null});k=f.index;g.updateParallelArrays(f,k);l&&f.name&&(l[f.x]=f.name);
p.data[k]=f.options;g.isDirty=g.isDirtyData=!0;!g.fixedBox&&g.hasCartesianSeries&&(n.isDirtyBox=!0);"point"===p.legendType&&(n.isDirtyLegend=!0);b&&n.redraw(c)}var f=this,g=f.series,h=f.graphic,k,n=g.chart,p=g.options,l=g.xAxis&&g.xAxis.names;b=z(b,!0);!1===d?e():f.firePointEvent("update",{options:a},e)},remove:function(a,b){this.series.removePoint(Qa(this,this.series.data),a,b)}});M(ea.prototype,{addPoint:function(a,b,c,d){var e=this,f=e.options,g=e.data,h=e.graph,k=e.area,n=e.chart,p=e.xAxis&&e.xAxis.names,
l=h&&h.shift||0,w=["graph","area"],h=f.data,u,r=e.xData;Ja(d,n);if(c){for(d=e.zones.length;d--;)w.push("zoneGraph"+d,"zoneArea"+d);v(w,function(a){e[a]&&(e[a].shift=l+(f.step?2:1))})}k&&(k.isArea=!0);b=z(b,!0);k={series:e};e.pointClass.prototype.applyOptions.apply(k,[a]);w=k.x;d=r.length;if(e.requireSorting&&w<r[d-1])for(u=!0;d&&r[d-1]>w;)d--;e.updateParallelArrays(k,"splice",d,0,0);e.updateParallelArrays(k,d);p&&k.name&&(p[w]=k.name);h.splice(d,0,a);u&&(e.data.splice(d,0,null),e.processData());"point"===
f.legendType&&e.generatePoints();c&&(g[0]&&g[0].remove?g[0].remove(!1):(g.shift(),e.updateParallelArrays(k,"shift"),h.shift()));e.isDirty=!0;e.isDirtyData=!0;b&&(e.getAttribs(),n.redraw())},removePoint:function(a,b,c){var d=this,e=d.data,f=e[a],g=d.points,h=d.chart,k=function(){e.length===g.length&&g.splice(a,1);e.splice(a,1);d.options.data.splice(a,1);d.updateParallelArrays(f||{series:d},"splice",a,1);f&&f.destroy();d.isDirty=!0;d.isDirtyData=!0;b&&h.redraw()};Ja(c,h);b=z(b,!0);f?f.firePointEvent("remove",
null,k):k()},remove:function(a,b){var c=this,d=c.chart;a=z(a,!0);c.isRemoving||(c.isRemoving=!0,da(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=!0;d.linkSeries();a&&d.redraw(b)}));c.isRemoving=!1},update:function(a,b){var c=this,d=this.chart,e=this.userOptions,f=this.type,g=W[f].prototype,h=["group","markerGroup","dataLabelsGroup"],k;if(a.type&&a.type!==f||void 0!==a.zIndex)h.length=0;v(h,function(a){h[a]=c[a];delete c[a]});a=x(e,{animation:!1,index:this.index,pointStart:this.xData[0]},
{data:this.options.data},a);this.remove(!1);for(k in g)this[k]=E;M(this,W[a.type||f].prototype);v(h,function(a){c[a]=h[a]});this.init(d,a);d.linkSeries();z(b,!0)&&d.redraw(!1)}});M(wa.prototype,{update:function(a,b){var c=this.chart;a=c.options[this.coll][this.options.index]=x(this.userOptions,a);this.destroy(!0);this._addedPlotLB=this.chart._labelPanes=E;this.init(c,M(a,{events:E}));c.isDirtyBox=!0;z(b,!0)&&c.redraw()},remove:function(a){for(var b=this.chart,c=this.coll,d=this.series,e=d.length;e--;)d[e]&&
d[e].remove(!1);q(b.axes,this);q(b[c],this);b.options[c].splice(this.options.index,1);v(b[c],function(a,b){a.options.index=b});this.destroy();b.isDirtyBox=!0;z(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}});var Nb=Q(ea);W.line=Nb;ma.area=x(Cb,{softThreshold:!1,threshold:0});var Ob=Q(ea,{type:"area",getSegments:function(){var a=this,b=[],c=[],d=[],e=this.xAxis,f=this.yAxis,g=f.stacks[this.stackKey],h={},k,n,p=this.points,
l=this.options.connectNulls,w,u,r;if(this.options.stacking&&!this.cropped){for(u=0;u<p.length;u++)h[p[u].x]=p[u];for(r in g)null!==g[r].total&&d.push(+r);d.sort(function(a,b){return a-b});v(d,function(b){var d=null,p;if(!l||h[b]&&null!==h[b].y)if(h[b])c.push(h[b]);else{for(u=a.index;u<=f.series.length;u++)if(w=a.getStackIndicator(null,b,u),p=g[b].points[w.key]){d=p[1];break}k=e.translate(b);n=f.getThreshold(d);c.push({y:null,plotX:k,clientX:k,plotY:n,yBottom:n,onMouseOver:sa})}});c.length&&b.push(c)}else ea.prototype.getSegments.call(this),
b=this.segments;this.segments=b},getSegmentPath:function(a){var b=ea.prototype.getSegmentPath.call(this,a),c=[].concat(b),d,e=this.options;d=b.length;var f=this.yAxis.getThreshold(e.threshold),g;3===d&&c.push("L",b[1],b[2]);if(e.stacking&&!this.closedStacks)for(d=a.length-1;0<=d;d--)g=z(a[d].yBottom,f),d<a.length-1&&e.step&&c.push(a[d+1].plotX,g),c.push(a[d].plotX,g);else this.closeSegment(c,a,f);this.areaPath=this.areaPath.concat(c);return b},closeSegment:function(a,b,c){a.push("L",b[b.length-1].plotX,
c,"L",b[0].plotX,c)},drawGraph:function(){this.areaPath=[];ea.prototype.drawGraph.apply(this);var a=this,b=this.areaPath,c=this.options,d=[["area",this.color,c.fillColor]];v(this.zones,function(b,f){d.push(["zoneArea"+f,b.color||a.color,b.fillColor||c.fillColor])});v(d,function(d){var f=d[0],g=a[f];g?g.animate({d:b}):a[f]=a.chart.renderer.path(b).attr({fill:z(d[2],Aa(d[1]).setOpacity(z(c.fillOpacity,.75)).get()),zIndex:0}).add(a.group)})},drawLegendSymbol:pb.drawRectangle});W.area=Ob;ma.column=x(Cb,
{borderColor:"#FFFFFF",borderRadius:0,groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:.1,shadow:!1,halo:!1},select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}},dataLabels:{align:null,verticalAlign:null,y:null},softThreshold:!1,startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0});var qb=Q(ea,{type:"column",pointAttrToOptions:{stroke:"borderColor",fill:"color",r:"borderRadius"},cropShoulder:0,directTouch:!0,
trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){ea.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&v(b.series,function(b){b.type===a.type&&(b.isDirty=!0)})},getColumnMetrics:function(){var a=this,b=a.options,c=a.xAxis,d=a.yAxis,e=c.reversed,f,g={},h,k=0;!1===b.grouping?k=1:v(a.chart.series,function(b){var c=b.options,e=b.yAxis;b.type===a.type&&b.visible&&d.len===e.len&&d.pos===e.pos&&(c.stacking?(f=b.stackKey,g[f]===E&&(g[f]=k++),h=g[f]):!1!==c.grouping&&
(h=k++),b.columnIndex=h)});var n=U(ca(c.transA)*(c.ordinalSlope||b.pointRange||c.closestPointRange||c.tickInterval||1),c.len),p=n*b.groupPadding,l=(n-2*p)/k,b=U(b.maxPointWidth||c.len,z(b.pointWidth,l*(1-2*b.pointPadding)));return a.columnMetrics={width:b,offset:(l-b)/2+(p+((e?k-(a.columnIndex||0):a.columnIndex)||0)*l-n/2)*(e?-1:1)}},crispCol:function(a,b,c,d){var e=this.chart,f=this.borderWidth,g=-(f%2?.5:0),f=f%2?.5:1;e.inverted&&e.renderer.isVML&&(f+=1);c=Math.round(a+c)+g;a=Math.round(a)+g;c-=
a;g=.5>=ca(b);d=Math.round(b+d)+f;b=Math.round(b)+f;d-=b;g&&(--b,d+=1);return{x:a,y:b,width:c,height:d}},translate:function(){var a=this,b=a.chart,c=a.options,d=a.borderWidth=z(c.borderWidth,2>a.closestPointRange*a.xAxis.transA?0:1),e=a.yAxis,f=a.translatedThreshold=e.getThreshold(c.threshold),g=z(c.minPointLength,5),h=a.getColumnMetrics(),k=h.width,n=a.barW=H(k,1+2*d),p=a.pointXOffset=h.offset;b.inverted&&(f-=.5);c.pointPadding&&(n=xa(n));ea.prototype.translate.apply(a);v(a.points,function(c){var d=
U(z(c.yBottom,f),9E4),h=999+ca(d),h=U(H(-h,c.plotY),e.len+h),l=c.plotX+p,r=n,m=U(h,d),q,v=H(h,d)-m;ca(v)<g&&g&&(v=g,q=!e.reversed&&!c.negative||e.reversed&&c.negative,m=ca(m-f)>g?d-g:f-(q?g:0));c.barX=l;c.pointWidth=k;c.tooltipPos=b.inverted?[e.len+e.pos-b.plotLeft-h,a.xAxis.len-l-r/2,v]:[l+r/2,h+e.pos-b.plotTop,v];c.shapeType="rect";c.shapeArgs=a.crispCol(l,m,r,v)})},getSymbol:sa,drawLegendSymbol:pb.drawRectangle,drawGraph:sa,drawPoints:function(){var a=this,b=this.chart,c=a.options,d=b.renderer,
e=c.animationLimit||250,f,g;v(a.points,function(h){var k=h.plotY,n=h.graphic;k===E||isNaN(k)||null===h.y?n&&(h.graphic=n.destroy()):(f=h.shapeArgs,k=t(a.borderWidth)?{"stroke-width":a.borderWidth}:{},g=h.pointAttr[h.selected?"select":""]||a.pointAttr[""],n?(Sa(n),n.attr(k)[b.pointCount<e?"animate":"attr"](x(f))):h.graphic=d[h.shapeType](f).attr(k).attr(g).add(h.group||a.group).shadow(c.shadow,null,c.stacking&&!c.borderRadius))})},animate:function(a){var b=this.yAxis,c=this.options,d=this.chart.inverted,
e={};ra&&(a?(e.scaleY=.001,a=U(b.pos+b.len,H(b.pos,b.toPixels(c.threshold))),d?e.translateX=a-b.len:e.translateY=a,this.group.attr(e)):(e.scaleY=1,e[d?"translateX":"translateY"]=b.pos,this.group.animate(e,this.options.animation),this.animate=null))},remove:function(){var a=this,b=a.chart;b.hasRendered&&v(b.series,function(b){b.type===a.type&&(b.isDirty=!0)});ea.prototype.remove.apply(a,arguments)}});W.column=qb;ma.bar=x(ma.column);var Pb=Q(qb,{type:"bar",inverted:!0});W.bar=Pb;ea.prototype.drawDataLabels=
function(){var a=this,b=a.options,c=b.cursor,d=b.dataLabels,e=a.points,f,g,h=a.hasRendered||0,k,n,p=a.chart.renderer;if(d.enabled||a._hasPointLabels)a.dlProcessOptions&&a.dlProcessOptions(d),n=a.plotGroup("dataLabelsGroup","data-labels",d.defer?"hidden":"visible",d.zIndex||6),z(d.defer,!0)&&(n.attr({opacity:+h}),h||ia(a,"afterAnimate",function(){a.visible&&n.show();n[b.animation?"animate":"attr"]({opacity:1},{duration:200})})),g=d,v(e,function(e){var h,l=e.dataLabel,r,m,q=e.connector,v=!0,D,K={};
f=e.dlOptions||e.options&&e.options.dataLabels;h=z(f&&f.enabled,g.enabled);if(l&&!h)e.dataLabel=l.destroy();else if(h){d=x(g,f);D=d.style;h=d.rotation;r=e.getLabelConfig();k=d.format?G(d.format,r):d.formatter.call(r,d);D.color=z(d.color,D.color,a.color,"black");if(l)t(k)?(l.attr({text:k}),v=!1):(e.dataLabel=l=l.destroy(),q&&(e.connector=q.destroy()));else if(t(k)){l={fill:d.backgroundColor,stroke:d.borderColor,"stroke-width":d.borderWidth,r:d.borderRadius||0,rotation:h,padding:d.padding,zIndex:1};
"contrast"===D.color&&(K.color=d.inside||0>d.distance||b.stacking?p.getContrast(e.color||a.color):"#000000");c&&(K.cursor=c);for(m in l)l[m]===E&&delete l[m];l=e.dataLabel=p[h?"text":"label"](k,0,-999,d.shape,null,null,d.useHTML).attr(l).css(M(D,K)).add(n).shadow(d.shadow)}l&&a.alignDataLabel(e,l,d,null,v)}})};ea.prototype.alignDataLabel=function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=z(a.plotX,-999),k=z(a.plotY,-999),n=b.getBBox(),p=f.renderer.fontMetrics(c.style.fontSize).b,l=this.visible&&
(a.series.forceDL||f.isInsidePlot(h,O(k),g)||d&&f.isInsidePlot(h,g?d.x+1:d.y+d.height-1,g));l&&(d=M({x:g?f.plotWidth-k:h,y:O(g?f.plotHeight-h:k),width:0,height:0},d),M(c,{width:n.width,height:n.height}),c.rotation?(a=f.renderer.rotCorr(p,c.rotation),b[e?"attr":"animate"]({x:d.x+c.x+d.width/2+a.x,y:d.y+c.y+d.height/2}).attr({align:c.align})):(b.align(c,null,d),g=b.alignAttr,"justify"===z(c.overflow,"justify")?this.justifyDataLabel(b,c,g,n,d,e):z(c.crop,!0)&&(l=f.isInsidePlot(g.x,g.y)&&f.isInsidePlot(g.x+
n.width,g.y+n.height)),c.shape&&b.attr({anchorX:a.plotX,anchorY:a.plotY})));l||(Sa(b),b.attr({y:-999}),b.placed=!1)};ea.prototype.justifyDataLabel=function(a,b,c,d,e,f){var g=this.chart,h=b.align,k=b.verticalAlign,n,p,l=a.box?0:a.padding||0;n=c.x+l;0>n&&("right"===h?b.align="left":b.x=-n,p=!0);n=c.x+d.width-l;n>g.plotWidth&&("left"===h?b.align="right":b.x=g.plotWidth-n,p=!0);n=c.y+l;0>n&&("bottom"===k?b.verticalAlign="top":b.y=-n,p=!0);n=c.y+d.height-l;n>g.plotHeight&&("top"===k?b.verticalAlign="bottom":
b.y=g.plotHeight-n,p=!0);p&&(a.placed=!f,a.align(b,null,e))};W.pie&&(W.pie.prototype.drawDataLabels=function(){var a=this,b=a.data,c,d=a.chart,e=a.options.dataLabels,f=z(e.connectorPadding,10),g=z(e.connectorWidth,1),h=d.plotWidth,k=d.plotHeight,n,p,l=z(e.softConnector,!0),r=e.distance,u=a.center,m=u[2]/2,q=u[1],t=0<r,K,G,A,N=[[],[]],x,E,B,ha,C,F=[0,0,0,0],L=function(a,b){return b.y-a.y};if(a.visible&&(e.enabled||a._hasPointLabels)){ea.prototype.drawDataLabels.apply(a);v(b,function(a){a.dataLabel&&
a.visible&&N[a.half].push(a)});for(ha=2;ha--;){var fa=[],M=[],S=N[ha],ba=S.length,P;if(ba){a.sortByAngle(S,ha-.5);for(C=b=0;!b&&S[C];)b=S[C]&&S[C].dataLabel&&(S[C].dataLabel.getBBox().height||21),C++;if(0<r){G=U(q+m+r,d.plotHeight);for(C=H(0,q-m-r);C<=G;C+=b)fa.push(C);G=fa.length;if(ba>G){c=[].concat(S);c.sort(L);for(C=ba;C--;)c[C].rank=C;for(C=ba;C--;)S[C].rank>=G&&S.splice(C,1);ba=S.length}for(C=0;C<ba;C++){c=S[C];A=c.labelPos;c=9999;var Q,T;for(T=0;T<G;T++)Q=ca(fa[T]-A[1]),Q<c&&(c=Q,P=T);if(P<
C&&null!==fa[C])P=C;else for(G<ba-C+P&&null!==fa[C]&&(P=G-ba+C);null===fa[P];)P++;M.push({i:P,y:fa[P]});fa[P]=null}M.sort(L)}for(C=0;C<ba;C++){c=S[C];A=c.labelPos;K=c.dataLabel;B=!1===c.visible?"hidden":"inherit";c=A[1];if(0<r){if(G=M.pop(),P=G.i,E=G.y,c>E&&null!==fa[P+1]||c<E&&null!==fa[P-1])E=U(H(0,c),d.plotHeight)}else E=c;x=e.justify?u[0]+(ha?-1:1)*(m+r):a.getX(E===q-m-r||E===q+m+r?c:E,ha);K._attr={visibility:B,align:A[6]};K._pos={x:x+e.x+({left:f,right:-f}[A[6]]||0),y:E+e.y-10};K.connX=x;K.connY=
E;null===this.options.size&&(G=K.width,x-G<f?F[3]=H(O(G-x+f),F[3]):x+G>h-f&&(F[1]=H(O(x+G-h+f),F[1])),0>E-b/2?F[0]=H(O(-E+b/2),F[0]):E+b/2>k&&(F[2]=H(O(E+b/2-k),F[2])))}}}if(0===D(F)||this.verifyDataLabelOverflow(F))this.placeDataLabels(),t&&g&&v(this.points,function(b){n=b.connector;A=b.labelPos;(K=b.dataLabel)&&K._pos&&b.visible?(B=K._attr.visibility,x=K.connX,E=K.connY,p=l?["M",x+("left"===A[6]?5:-5),E,"C",x,E,2*A[2]-A[4],2*A[3]-A[5],A[2],A[3],"L",A[4],A[5]]:["M",x+("left"===A[6]?5:-5),E,"L",A[2],
A[3],"L",A[4],A[5]],n?(n.animate({d:p}),n.attr("visibility",B)):b.connector=n=a.chart.renderer.path(p).attr({"stroke-width":g,stroke:e.connectorColor||b.color||"#606060",visibility:B}).add(a.dataLabelsGroup)):n&&(b.connector=n.destroy())})}},W.pie.prototype.placeDataLabels=function(){v(this.points,function(a){var b=a.dataLabel;b&&a.visible&&((a=b._pos)?(b.attr(b._attr),b[b.moved?"animate":"attr"](a),b.moved=!0):b&&b.attr({y:-999}))})},W.pie.prototype.alignDataLabel=sa,W.pie.prototype.verifyDataLabelOverflow=
function(a){var b=this.center,c=this.options,d=c.center,e=c.minSize||80,f=e,g;null!==d[0]?f=H(b[2]-H(a[1],a[3]),e):(f=H(b[2]-a[1]-a[3],e),b[0]+=(a[3]-a[1])/2);null!==d[1]?f=H(U(f,b[2]-H(a[0],a[2])),e):(f=H(U(f,b[2]-a[0]-a[2]),e),b[1]+=(a[0]-a[2])/2);f<b[2]?(b[2]=f,b[3]=Math.min(ua(c.innerSize||0,f),f),this.translate(b),v(this.points,function(a){a.dataLabel&&(a.dataLabel._pos=null)}),this.drawDataLabels&&this.drawDataLabels()):g=!0;return g});W.column&&(W.column.prototype.alignDataLabel=function(a,
b,c,d,e){var f=this.chart.inverted,g=a.series,h=a.dlBox||a.shapeArgs,k=z(a.below,a.plotY>z(this.translatedThreshold,g.yAxis.len)),n=z(c.inside,!!this.options.stacking);h&&(d=x(h),f&&(d={x:g.yAxis.len-d.y-d.height,y:g.xAxis.len-d.x-d.width,width:d.height,height:d.width}),n||(f?(d.x+=k?0:d.width,d.width=0):(d.y+=k?d.height:0,d.height=0)));c.align=z(c.align,!f||n?"center":k?"right":"left");c.verticalAlign=z(c.verticalAlign,f||n?"middle":k?"top":"bottom");ea.prototype.alignDataLabel.call(this,a,b,c,d,
e)});var fb=X.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,c=b.pointer,d=a.options.cursor,e=d&&{cursor:d},f=function(a){for(var c=a.target,d;c&&!d;)d=c.point,c=c.parentNode;if(d!==E&&d!==b.hoverPoint)d.onMouseOver(a)};v(a.points,function(a){a.graphic&&(a.graphic.element.point=a);a.dataLabel&&(a.dataLabel.element.point=a)});a._hasTracking||(v(a.trackerGroups,function(b){if(a[b]&&(a[b].addClass("highcharts-tracker").on("mouseover",f).on("mouseout",function(a){c.onTrackerMouseOut(a)}).css(e),
Oa))a[b].on("touchstart",f)}),a._hasTracking=!0)},drawTrackerGraph:function(){var a=this,b=a.options,c=b.trackByArea,d=[].concat(c?a.areaPath:a.graphPath),e=d.length,f=a.chart,g=f.pointer,h=f.renderer,k=f.options.tooltip.snap,n=a.tracker,p=b.cursor,l=p&&{cursor:p},p=a.singlePoints,r,u=function(){if(f.hoverSeries!==a)a.onMouseOver()},m="rgba(192,192,192,"+(ra?1E-4:.002)+")";if(e&&!c)for(r=e+1;r--;)"M"===d[r]&&d.splice(r+1,0,d[r+1]-k,d[r+2],"L"),(r&&"M"===d[r]||r===e)&&d.splice(r,0,"L",d[r-2]+k,d[r-
1]);for(r=0;r<p.length;r++)e=p[r],d.push("M",e.plotX-k,e.plotY,"L",e.plotX+k,e.plotY);n?n.attr({d:d}):(a.tracker=h.path(d).attr({"stroke-linejoin":"round",visibility:a.visible?"visible":"hidden",stroke:m,fill:c?m:"none","stroke-width":b.lineWidth+(c?0:2*k),zIndex:2}).add(a.group),v([a.tracker,a.markerGroup],function(a){a.addClass("highcharts-tracker").on("mouseover",u).on("mouseout",function(a){g.onTrackerMouseOut(a)}).css(l);if(Oa)a.on("touchstart",u)}))}};W.column&&(qb.prototype.drawTracker=fb.drawTrackerPoint);
W.pie&&(W.pie.prototype.drawTracker=fb.drawTrackerPoint);W.scatter&&(ScatterSeries.prototype.drawTracker=fb.drawTrackerPoint);M(db.prototype,{setItemEvents:function(a,b,c,d,e){var f=this;(c?b:a.legendGroup).on("mouseover",function(){a.setState("hover");b.css(f.options.itemHoverStyle)}).on("mouseout",function(){b.css(a.visible?d:e);a.setState()}).on("click",function(b){var c=function(){a.setVisible&&a.setVisible()};b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,c):da(a,"legendItemClick",
b,c)})},createCheckboxForItem:function(a){a.checkbox=F("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);ia(a.checkbox,"click",function(b){da(a.series||a,"checkboxClick",{checked:b.target.checked,item:a},function(){a.select()})})}});ka.legend.itemStyle.cursor="pointer";M(eb.prototype,{showResetZoom:function(){var a=this,b=ka.lang,c=a.options.chart.resetZoomButton,d=c.theme,e=d.states,f="chart"===c.relativeTo?null:"plotBox";
this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,e&&e.hover).attr({align:c.position.align,title:b.resetZoomTitle}).add().align(c.position,!1,f)},zoomOut:function(){var a=this;da(a,"selection",{resetSelection:!0},function(){a.zoom()})},zoom:function(a){var b,c=this.pointer,d=!1,e;!a||a.resetSelection?v(this.axes,function(a){b=a.zoom()}):v(a.xAxis.concat(a.yAxis),function(a){var e=a.axis,h=e.isXAxis;if(c[h?"zoomX":"zoomY"]||c[h?"pinchX":"pinchY"])b=e.zoom(a.min,
a.max),e.displayBtn&&(d=!0)});e=this.resetZoomButton;d&&!e?this.showResetZoom():!d&&ga(e)&&(this.resetZoomButton=e.destroy());b&&this.redraw(z(this.options.chart.animation,a&&a.animation,100>this.pointCount))},pan:function(a,b){var c=this,d=c.hoverPoints,e;d&&v(d,function(a){a.setState()});v("xy"===b?[1,0]:[1],function(b){var d=a[b?"chartX":"chartY"],h=c[b?"xAxis":"yAxis"][0],k=c[b?"mouseDownX":"mouseDownY"],n=(h.pointRange||0)/2,p=h.getExtremes(),l=h.toValue(k-d,!0)+n,n=h.toValue(k+c[b?"plotWidth":
"plotHeight"]-d,!0)-n,k=k>d;h.series.length&&(k||l>U(p.dataMin,p.min))&&(!k||n<H(p.dataMax,p.max))&&(h.setExtremes(l,n,!1,!1,{trigger:"pan"}),e=!0);c[b?"mouseDownX":"mouseDownY"]=d});e&&c.redraw(!1);A(c.container,{cursor:"move"})}});M(Ia.prototype,{select:function(a,b){var c=this,d=c.series,e=d.chart;a=z(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=c.options.selected=a;d.options.data[Qa(c,d.data)]=c.options;c.setState(a&&"select");b||v(e.getSelectedPoints(),
function(a){a.selected&&a!==c&&(a.selected=a.options.selected=!1,d.options.data[Qa(a,d.data)]=a.options,a.setState(""),a.firePointEvent("unselect"))})})},onMouseOver:function(a,b){var c=this.series,d=c.chart,e=d.tooltip,f=d.hoverPoint;if(d.hoverSeries!==c)c.onMouseOver();if(f&&f!==this)f.onMouseOut();this.series&&(this.firePointEvent("mouseOver"),!e||e.shared&&!c.noSharedTooltip||e.refresh(this,a),this.setState("hover"),b||(d.hoverPoint=this))},onMouseOut:function(){var a=this.series.chart,b=a.hoverPoints;
this.firePointEvent("mouseOut");b&&-1!==Qa(this,b)||(this.setState(),a.hoverPoint=null)},importEvents:function(){if(!this.hasImportedEvents){var a=x(this.series.options.point,this.options).events,b;this.events=a;for(b in a)ia(this,b,a[b]);this.hasImportedEvents=!0}},setState:function(a,b){var c=Y(this.plotX),d=this.plotY,e=this.series,f=e.options.states,g=ma[e.type].marker&&e.options.marker,h=g&&!g.enabled,k=g&&g.states[a],n=k&&!1===k.enabled,p=e.stateMarkerGraphic,l=this.marker||{},r=e.chart,m=e.halo,
q;a=a||"";q=this.pointAttr[a]||e.pointAttr[a];if(!(a===this.state&&!b||this.selected&&"select"!==a||f[a]&&!1===f[a].enabled||a&&(n||h&&!1===k.enabled)||a&&l.states&&l.states[a]&&!1===l.states[a].enabled)){if(this.graphic)g=g&&this.graphic.symbolName&&q.r,this.graphic.attr(x(q,g?{x:c-g,y:d-g,width:2*g,height:2*g}:{})),p&&p.hide();else{if(a&&k)if(g=k.radius,l=l.symbol||e.symbol,p&&p.currentSymbol!==l&&(p=p.destroy()),p)p[b?"animate":"attr"]({x:c-g,y:d-g});else l&&(e.stateMarkerGraphic=p=r.renderer.symbol(l,
c-g,d-g,2*g,2*g).attr(q).add(e.markerGroup),p.currentSymbol=l);p&&(p[a&&r.isInsidePlot(c,d,r.inverted)?"show":"hide"](),p.element.point=this)}(c=f[a]&&f[a].halo)&&c.size?(m||(e.halo=m=r.renderer.path().add(r.seriesGroup)),m.attr(M({fill:Aa(this.color||e.color).setOpacity(c.opacity).get()},c.attributes))[b?"animate":"attr"]({d:this.haloPath(c.size)})):m&&m.attr({d:[]});this.state=a}},haloPath:function(a){var b=this.series,c=b.chart,d=b.getPlotBox(),e=c.inverted;return c.renderer.symbols.circle(d.translateX+
(e?b.yAxis.len-this.plotY:this.plotX)-a,d.translateY+(e?b.xAxis.len-this.plotX:this.plotY)-a,2*a,2*a)}});M(ea.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&da(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;b.hoverSeries=null;if(d)d.onMouseOut();this&&a.events.mouseOut&&da(this,"mouseOut");!c||a.stickyTracking||c.shared&&!this.noSharedTooltip||
c.hide();this.setState()},setState:function(a){var b=this.options,c=this.graph,d=b.states,e=b.lineWidth,b=0;a=a||"";if(this.state!==a&&(this.state=a,!d[a]||!1!==d[a].enabled)&&(a&&(e=d[a].lineWidth||e+(d[a].lineWidthPlus||0)),c&&!c.dashstyle))for(a={"stroke-width":e},c.attr(a);this["zoneGraph"+b];)this["zoneGraph"+b].attr(a),b+=1},setVisible:function(a,b){var c=this,d=c.chart,e=c.legendItem,f,g=d.options.chart.ignoreHiddenSeries,h=c.visible;f=(c.visible=a=c.userOptions.visible=a===E?!h:a)?"show":
"hide";v(["group","dataLabelsGroup","markerGroup","tracker"],function(a){if(c[a])c[a][f]()});if(d.hoverSeries===c||(d.hoverPoint&&d.hoverPoint.series)===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&v(d.series,function(a){a.options.stacking&&a.visible&&(a.isDirty=!0)});v(c.linkedSeries,function(b){b.setVisible(a,!1)});g&&(d.isDirtyBox=!0);!1!==b&&d.redraw();da(c,f)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=
a=a===E?!this.selected:a;this.checkbox&&(this.checkbox.checked=a);da(this,a?"select":"unselect")},drawTracker:fb.drawTrackerGraph});ma.arearange=x(ma.area,{lineWidth:1,marker:null,threshold:null,tooltip:{pointFormat:'<span style="color:{series.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},trackByArea:!0,dataLabels:{align:null,verticalAlign:null,xLow:0,xHigh:0,yLow:0,yHigh:0},states:{hover:{halo:!1}}});W.arearange=Q(W.area,{type:"arearange",pointArrayMap:["low",
"high"],dataLabelCollections:["dataLabel","dataLabelUpper"],toYData:function(a){return[a.low,a.high]},pointValKey:"low",deferTranslatePolar:!0,highToXY:function(a){var b=this.chart,c=this.xAxis.postTranslate(a.rectPlotX,this.yAxis.len-a.plotHigh);a.plotHighX=c.x-b.plotLeft;a.plotHigh=c.y-b.plotTop},getSegments:function(){var a=this;v(a.points,function(b){a.options.connectNulls||null!==b.low&&null!==b.high?null===b.low&&null!==b.high&&(b.y=b.high):b.y=null});ea.prototype.getSegments.call(this)},translate:function(){var a=
this,b=a.yAxis;W.area.prototype.translate.apply(a);v(a.points,function(a){var d=a.low,e=a.high,f=a.plotY;null===e&&null===d?a.y=null:null===d?(a.plotLow=a.plotY=null,a.plotHigh=b.translate(e,0,1,0,1)):null===e?(a.plotLow=f,a.plotHigh=null):(a.plotLow=f,a.plotHigh=b.translate(e,0,1,0,1))});this.chart.polar&&v(this.points,function(b){a.highToXY(b)})},getSegmentPath:function(a){var b,c=[],d=a.length,e=ea.prototype.getSegmentPath,f,g;g=this.options;var h=g.step;for(b=HighchartsAdapter.grep(a,function(a){return null!==
a.plotLow});d--;)f=a[d],null!==f.plotHigh&&c.push({plotX:f.plotHighX||f.plotX,plotY:f.plotHigh});a=e.call(this,b);h&&(!0===h&&(h="left"),g.step={left:"right",center:"center",right:"left"}[h]);c=e.call(this,c);g.step=h;g=[].concat(a,c);this.chart.polar||(c[0]="L");this.areaPath=this.areaPath.concat(a,c);return g},drawDataLabels:function(){var a=this.data,b=a.length,c,d=[],e=ea.prototype,f=this.options.dataLabels,g=f.align,h=f.inside,k,n,p=this.chart.inverted;if(f.enabled||this._hasPointLabels){for(c=
b;c--;)if(k=a[c])n=h?k.plotHigh<k.plotLow:k.plotHigh>k.plotLow,k.y=k.high,k._plotY=k.plotY,k.plotY=k.plotHigh,d[c]=k.dataLabel,k.dataLabel=k.dataLabelUpper,k.below=n,p?(g||(f.align=n?"right":"left"),f.x=f.xHigh):f.y=f.yHigh;e.drawDataLabels&&e.drawDataLabels.apply(this,arguments);for(c=b;c--;)if(k=a[c])n=h?k.plotHigh<k.plotLow:k.plotHigh>k.plotLow,k.dataLabelUpper=k.dataLabel,k.dataLabel=d[c],k.y=k.low,k.plotY=k._plotY,k.below=!n,p?(g||(f.align=n?"left":"right"),f.x=f.xLow):f.y=f.yLow;e.drawDataLabels&&
e.drawDataLabels.apply(this,arguments)}f.align=g},alignDataLabel:function(){W.column.prototype.alignDataLabel.apply(this,arguments)},setStackedPoints:sa,getSymbol:sa,drawPoints:sa});(function(){var a=W.column.prototype;ma.columnrange=x(ma.column,ma.arearange,{lineWidth:1,pointRange:null});W.columnrange=Q(W.arearange,{type:"columnrange",translate:function(){var b=this,c=b.yAxis,d;a.translate.apply(b);v(b.points,function(a){var f=a.shapeArgs,g=b.options.minPointLength,h;a.tooltipPos=null;a.plotHigh=
d=c.translate(a.high,0,1,0,1);a.plotLow=a.plotY;h=d;a=a.plotY-d;Math.abs(a)<g?(g-=a,a+=g,h-=g/2):0>a&&(a*=-1,h-=a);f.height=a;f.y=h})},directTouch:!0,trackerGroups:["group","dataLabelsGroup"],drawGraph:sa,crispCol:a.crispCol,pointAttrToOptions:a.pointAttrToOptions,drawPoints:a.drawPoints,drawTracker:a.drawTracker,animate:a.animate,getColumnMetrics:a.getColumnMetrics})})();ma.boxplot=x(ma.column,{fillColor:"#FFFFFF",lineWidth:1,medianWidth:2,states:{hover:{brightness:-.3}},threshold:null,tooltip:{pointFormat:'<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>'},
whiskerLength:"50%",whiskerWidth:2});W.boxplot=Q(W.column,{type:"boxplot",pointArrayMap:["low","q1","median","q3","high"],toYData:function(a){return[a.low,a.q1,a.median,a.q3,a.high]},pointValKey:"high",pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth"},drawDataLabels:sa,translate:function(){var a=this.yAxis,b=this.pointArrayMap;W.column.prototype.translate.apply(this);v(this.points,function(c){v(b,function(b){null!==c[b]&&(c[b+"Plot"]=a.translate(c[b],0,1,0,1))})})},drawPoints:function(){var a=
this,b=a.options,c=a.chart.renderer,d,e,f,g,h,k,n,p,l,r,m,q,t,D,K,G,A,C,x,N,ha,B,H=!1!==a.doQuartiles,F,fa=a.options.whiskerLength;v(a.points,function(v){l=v.graphic;ha=v.shapeArgs;m={};D={};G={};B=v.color||a.color;v.plotY!==E&&(d=v.pointAttr[v.selected?"selected":""],A=ha.width,C=Y(ha.x),x=C+A,N=O(A/2),e=Y(H?v.q1Plot:v.lowPlot),f=Y(H?v.q3Plot:v.lowPlot),g=Y(v.highPlot),h=Y(v.lowPlot),m.stroke=v.stemColor||b.stemColor||B,m["stroke-width"]=z(v.stemWidth,b.stemWidth,b.lineWidth),m.dashstyle=v.stemDashStyle||
b.stemDashStyle,D.stroke=v.whiskerColor||b.whiskerColor||B,D["stroke-width"]=z(v.whiskerWidth,b.whiskerWidth,b.lineWidth),G.stroke=v.medianColor||b.medianColor||B,G["stroke-width"]=z(v.medianWidth,b.medianWidth,b.lineWidth),n=m["stroke-width"]%2/2,p=C+N+n,r=["M",p,f,"L",p,g,"M",p,e,"L",p,h],H&&(n=d["stroke-width"]%2/2,p=Y(p)+n,e=Y(e)+n,f=Y(f)+n,C+=n,x+=n,q=["M",C,f,"L",C,e,"L",x,e,"L",x,f,"L",C,f,"z"]),fa&&(n=D["stroke-width"]%2/2,g+=n,h+=n,F=/%$/.test(fa)?N*parseFloat(fa)/100:fa/2,t=["M",p-F,g,"L",
p+F,g,"M",p-F,h,"L",p+F,h]),n=G["stroke-width"]%2/2,k=O(v.medianPlot)+n,K=["M",C,k,"L",x,k],l?(v.stem.animate({d:r}),fa&&v.whiskers.animate({d:t}),H&&v.box.animate({d:q}),v.medianShape.animate({d:K})):(v.graphic=l=c.g().add(a.group),v.stem=c.path(r).attr(m).add(l),fa&&(v.whiskers=c.path(t).attr(D).add(l)),H&&(v.box=c.path(q).attr(d).add(l)),v.medianShape=c.path(K).attr(G).add(l)))})},setStackedPoints:sa});ma.waterfall=x(ma.column,{lineWidth:1,lineColor:"#333",dashStyle:"dot",borderColor:"#333",dataLabels:{inside:!0},
states:{hover:{lineWidthPlus:0}}});W.waterfall=Q(W.column,{type:"waterfall",upColorProp:"fill",pointValKey:"y",translate:function(){var a=this.options,b=this.yAxis,c,d,e,f,g,h,k,n,p,l=a.threshold,r=a.stacking;W.column.prototype.translate.apply(this);k=n=l;d=this.points;c=0;for(a=d.length;c<a;c++)e=d[c],h=this.processedYData[c],f=e.shapeArgs,p=(g=r&&b.stacks[(this.negStacks&&h<l?"-":"")+this.stackKey])?g[e.x].points[this.index+","+c]:[0,h],e.isSum?e.y=h:e.isIntermediateSum&&(e.y=h-n),g=H(k,k+e.y)+
p[0],f.y=b.translate(g,0,1),e.isSum?(f.y=b.translate(p[1],0,1),f.height=Math.min(b.translate(p[0],0,1),b.len)-f.y):e.isIntermediateSum?(f.y=b.translate(p[1],0,1),f.height=Math.min(b.translate(n,0,1),b.len)-f.y,n=p[1]):(0!==k&&(f.height=0<h?b.translate(k,0,1)-f.y:b.translate(k,0,1)-b.translate(k-h,0,1)),k+=h),0>f.height&&(f.y+=f.height,f.height*=-1),e.plotY=f.y=O(f.y)-this.borderWidth%2/2,f.height=H(O(f.height),.001),e.yBottom=f.y+f.height,f=e.plotY+(e.negative?f.height:0),this.chart.inverted?e.tooltipPos[0]=
b.len-f:e.tooltipPos[1]=f},processData:function(a){var b=this.yData,c=this.options.data,d,e=b.length,f,g,h,k,n,p;g=f=h=k=this.options.threshold||0;for(p=0;p<e;p++)n=b[p],d=c&&c[p]?c[p]:{},"sum"===n||d.isSum?b[p]=g:"intermediateSum"===n||d.isIntermediateSum?b[p]=f:(g+=n,f+=n),h=Math.min(g,h),k=Math.max(g,k);ea.prototype.processData.call(this,a);this.dataMin=h;this.dataMax=k},toYData:function(a){return a.isSum?0===a.x?null:"sum":a.isIntermediateSum?0===a.x?null:"intermediateSum":a.y},getAttribs:function(){W.column.prototype.getAttribs.apply(this,
arguments);var a=this,b=a.options,c=b.states,d=b.upColor||a.color,b=X.Color(d).brighten(.1).get(),e=x(a.pointAttr),f=a.upColorProp;e[""][f]=d;e.hover[f]=c.hover.upColor||b;e.select[f]=c.select.upColor||d;v(a.points,function(b){b.options.color||(0<b.y?(b.pointAttr=e,b.color=d):b.pointAttr=a.pointAttr)})},getGraphPath:function(){var a=this.data,b=a.length,c=O(this.options.lineWidth+this.borderWidth)%2/2,d=[],e,f,g;for(g=1;g<b;g++)f=a[g].shapeArgs,e=a[g-1].shapeArgs,f=["M",e.x+e.width,e.y+c,"L",f.x,
e.y+c],0>a[g-1].y&&(f[2]+=e.height,f[5]+=e.height),d=d.concat(f);return d},getExtremes:sa,drawGraph:ea.prototype.drawGraph});M(X,{Color:Aa,Point:Ia,Tick:Fa,Renderer:bb,SVGElement:S,SVGRenderer:bb,arrayMin:K,arrayMax:D,charts:pa,dateFormat:Ea,error:ba,format:G,pathAnim:ob,getOptions:function(){return ka},hasBidiBug:Gb,isTouchDevice:zb,setOptions:function(a){ka=x(!0,ka,a);rb();return ka},addEvent:ia,removeEvent:qa,createElement:F,discardElement:fa,css:A,each:v,map:Ra,merge:x,splat:B,extendClass:Q,pInt:J,
svg:ra,canvas:va,vml:!ra&&!va,product:"Highcharts 4.1.9",version:"/Highstock 2.1.9"})})();
(function(x){var J=x.Chart,ja=x.addEvent,ga=x.removeEvent,aa=HighchartsAdapter.fireEvent,V=x.createElement,oa=x.discardElement,m=x.css,q=x.merge,t=x.each,N=x.extend,B=x.splat,A=Math.max,F=document,Q=window,L=x.isTouchDevice,ua=x.Renderer.prototype.symbols,T=x.getOptions(),G;N(T.lang,{printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",contextButtonTitle:"Chart context menu"});T.navigation=
{menuStyle:{border:"1px solid #A0A0A0",background:"#FFFFFF",padding:"5px 0"},menuItemStyle:{padding:"0 10px",background:"none",color:"#303030",fontSize:L?"14px":"11px"},menuItemHoverStyle:{background:"#4572A5",color:"#FFFFFF"},buttonOptions:{symbolFill:"#E0E0E0",symbolSize:14,symbolStroke:"#666",symbolStrokeWidth:3,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,theme:{fill:"white",stroke:"none"},verticalAlign:"top",width:24}};T.exporting={type:"image/png",url:"http://export.highcharts.com/",
buttons:{contextButton:{menuClassName:"highcharts-contextmenu",symbol:"menu",_titleKey:"contextButtonTitle",menuItems:[{textKey:"printChart",onclick:function(){this.print()}},{separator:!0},{textKey:"downloadPNG",onclick:function(){this.exportChart()}},{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}]}}};
x.post=function(r,l,m){var D;r=V("form",q({method:"post",action:r,enctype:"multipart/form-data"},m),{display:"none"},F.body);for(D in l)V("input",{type:"hidden",name:D,value:l[D]},null,r);r.submit();oa(r)};N(J.prototype,{sanitizeSVG:function(r){return r.replace(/zIndex="[^"]+"/g,"").replace(/isShadow="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,'<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g,
" xlink:href=").replace(/\n/," ").replace(/<\/svg>.*?$/,"</svg>").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g,'$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g,"\u00a0").replace(/&shy;/g,"\u00ad").replace(/<IMG /g,"<image ").replace(/<(\/?)TITLE>/g,"<$1title>").replace(/height=([^" ]+)/g,'height="$1"').replace(/width=([^" ]+)/g,'width="$1"').replace(/hc-svg-href="([^"]+)">/g,'xlink:href="$1"/>').replace(/ id=([^" >]+)/g,' id="$1"').replace(/class=([^" >]+)/g,'class="$1"').replace(/ transform /g,
" ").replace(/:(path|rect)/g,"$1").replace(/style="([^"]+)"/g,function(l){return l.toLowerCase()})},getChartHTML:function(){return this.container.innerHTML},getSVG:function(r){var l=this,m,D,G,A,ba,C=q(l.options,r),L=C.exporting.allowHTML;F.createElementNS||(F.createElementNS=function(l,r){return F.createElement(r)});D=V("div",null,{position:"absolute",top:"-9999em",width:l.chartWidth+"px",height:l.chartHeight+"px"},F.body);G=l.renderTo.style.width;ba=l.renderTo.style.height;G=C.exporting.sourceWidth||
C.chart.width||/px$/.test(G)&&parseInt(G,10)||600;ba=C.exporting.sourceHeight||C.chart.height||/px$/.test(ba)&&parseInt(ba,10)||400;N(C.chart,{animation:!1,renderTo:D,forExport:!0,renderer:"SVGRenderer",width:G,height:ba});C.exporting.enabled=!1;delete C.data;C.series=[];t(l.series,function(l){A=q(l.options,{animation:!1,enableMouseTracking:!1,showCheckbox:!1,visible:l.visible});A.isInternal||C.series.push(A)});r&&t(["xAxis","yAxis"],function(l){t(B(r[l]),function(r,m){C[l][m]=q(C[l][m],r)})});m=
new x.Chart(C,l.callback);t(["xAxis","yAxis"],function(r){t(l[r],function(l,q){var D=m[r][q],t=l.getExtremes(),G=t.userMin,t=t.userMax;!D||void 0===G&&void 0===t||D.setExtremes(G,t,!0,!1)})});G=m.getChartHTML();C=null;m.destroy();oa(D);L&&(D=G.match(/<\/svg>(.*?$)/))&&(D='<foreignObject x="0" y="0" width="200" height="200"><body xmlns="http://www.w3.org/1999/xhtml">'+D[1]+"</body></foreignObject>",G=G.replace("</svg>",D+"</svg>"));G=this.sanitizeSVG(G);return G=G.replace(/(url\(#highcharts-[0-9]+)&quot;/g,
"$1").replace(/&quot;/g,"'")},getSVGForExport:function(r,l){var m=this.options.exporting;return this.getSVG(q({chart:{borderRadius:0}},m.chartOptions,l,{exporting:{sourceWidth:r&&r.sourceWidth||m.sourceWidth,sourceHeight:r&&r.sourceHeight||m.sourceHeight}}))},exportChart:function(r,l){var m=this.getSVGForExport(r,l);r=q(this.options.exporting,r);x.post(r.url,{filename:r.filename||"chart",type:r.type,width:r.width||0,scale:r.scale||2,svg:m},r.formAttributes)},print:function(){var r=this,l=r.container,
m=[],q=l.parentNode,G=F.body,A=G.childNodes;r.isPrinting||(r.isPrinting=!0,aa(r,"beforePrint"),t(A,function(l,r){1===l.nodeType&&(m[r]=l.style.display,l.style.display="none")}),G.appendChild(l),Q.focus(),Q.print(),setTimeout(function(){q.appendChild(l);t(A,function(l,r){1===l.nodeType&&(l.style.display=m[r])});r.isPrinting=!1;aa(r,"afterPrint")},1E3))},contextMenu:function(r,l,q,D,G,x,B){var C=this,F=C.options.navigation,L=F.menuItemStyle,S=C.chartWidth,Q=C.chartHeight,T="cache-"+r,E=C[T],P=A(G,x),
J,ua,O,Y=function(l){C.pointer.inClass(l.target,r)||ua()};E||(C[T]=E=V("div",{className:r},{position:"absolute",zIndex:1E3,padding:P+"px"},C.container),J=V("div",null,N({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},F.menuStyle),E),ua=function(){m(E,{display:"none"});B&&B.setState(0);C.openMenu=!1},ja(E,"mouseleave",function(){O=setTimeout(ua,500)}),ja(E,"mouseenter",function(){clearTimeout(O)}),ja(document,"mouseup",Y),ja(C,"destroy",function(){ga(document,
"mouseup",Y)}),t(l,function(l){if(l){var r=l.separator?V("hr",null,null,J):V("div",{onmouseover:function(){m(this,F.menuItemHoverStyle)},onmouseout:function(){m(this,L)},onclick:function(r){r.stopPropagation();ua();l.onclick&&l.onclick.apply(C,arguments)},innerHTML:l.text||C.options.lang[l.textKey]},N({cursor:"pointer"},L),J);C.exportDivElements.push(r)}}),C.exportDivElements.push(J,E),C.exportMenuWidth=E.offsetWidth,C.exportMenuHeight=E.offsetHeight);l={display:"block"};q+C.exportMenuWidth>S?l.right=
S-q-G-P+"px":l.left=q-P+"px";D+x+C.exportMenuHeight>Q&&"top"!==B.alignOptions.verticalAlign?l.bottom=Q-D-P+"px":l.top=D+x-P+"px";m(E,l);C.openMenu=!0},addButton:function(r){var l=this,m=l.renderer,t=q(l.options.navigation.buttonOptions,r),A=t.onclick,B=t.menuItems,F,C,L={stroke:t.symbolStroke,fill:t.symbolFill},Q=t.symbolSize||12;l.btnCount||(l.btnCount=0);l.exportDivElements||(l.exportDivElements=[],l.exportSVGElements=[]);if(!1!==t.enabled){var S=t.theme,T=S.states,J=T&&T.hover,T=T&&T.select,E;
delete S.states;A?E=function(r){r.stopPropagation();A.call(l,r)}:B&&(E=function(){l.contextMenu(C.menuClassName,B,C.translateX,C.translateY,C.width,C.height,C);C.setState(2)});t.text&&t.symbol?S.paddingLeft=x.pick(S.paddingLeft,25):t.text||N(S,{width:t.width,height:t.height,padding:0});C=m.button(t.text,0,0,E,S,J,T).attr({title:l.options.lang[t._titleKey],"stroke-linecap":"round"});C.menuClassName=r.menuClassName||"highcharts-menu-"+l.btnCount++;t.symbol&&(F=m.symbol(t.symbol,t.symbolX-Q/2,t.symbolY-
Q/2,Q,Q).attr(N(L,{"stroke-width":t.symbolStrokeWidth||1,zIndex:1})).add(C));C.add().align(N(t,{width:C.width,x:x.pick(t.x,G)}),!0,"spacingBox");G+=(C.width+t.buttonSpacing)*("right"===t.align?-1:1);l.exportSVGElements.push(C,F)}},destroyExport:function(r){r=r.target;var l,m;for(l=0;l<r.exportSVGElements.length;l++)if(m=r.exportSVGElements[l])m.onclick=m.ontouchstart=null,r.exportSVGElements[l]=m.destroy();for(l=0;l<r.exportDivElements.length;l++)m=r.exportDivElements[l],ga(m,"mouseleave"),r.exportDivElements[l]=
m.onmouseout=m.onmouseover=m.ontouchstart=m.onclick=null,oa(m)}});ua.menu=function(r,l,m,q){return["M",r,l+2.5,"L",r+m,l+2.5,"M",r,l+q/2+.5,"L",r+m,l+q/2+.5,"M",r,l+q-1.5,"L",r+m,l+q-1.5]};J.prototype.callbacks.push(function(r){var l,m=r.options.exporting,q=m.buttons;G=0;if(!1!==m.enabled){for(l in q)r.addButton(q[l]);ja(r,"destroy",r.destroyExport)}})})(Highcharts);
(function(x){var J=x.each,ja=x.pick,ga=HighchartsAdapter.inArray,aa=x.splat,V,oa=function(m,q){this.init(m,q)};x.extend(oa.prototype,{init:function(m,q){this.options=m;this.chartOptions=q;this.columns=m.columns||this.rowsToColumns(m.rows)||[];this.firstRowAsNames=ja(m.firstRowAsNames,!0);this.decimalRegex=m.decimalPoint&&new RegExp("^([0-9]+)"+m.decimalPoint+"([0-9]+)$");this.rawColumns=[];this.columns.length?this.dataFound():(this.parseCSV(),this.parseTable(),this.parseGoogleSpreadsheet())},getColumnDistribution:function(){var m=
this.chartOptions,q=this.options,t=[],N=function(m){return(x.seriesTypes[m||"line"].prototype.pointArrayMap||[0]).length},B=m&&m.chart&&m.chart.type,A=[],F=[],Q=0,L;J(m&&m.series||[],function(m){A.push(N(m.type||B))});J(q&&q.seriesMapping||[],function(m){t.push(m.x||0)});0===t.length&&t.push(0);J(q&&q.seriesMapping||[],function(q){var t=new V,G,r=A[Q]||N(B),l=x.seriesTypes[((m&&m.series||[])[Q]||{}).type||B||"line"].prototype.pointArrayMap||["y"];t.addColumnReader(q.x,"x");for(G in q)q.hasOwnProperty(G)&&
"x"!==G&&t.addColumnReader(q[G],G);for(L=0;L<r;L++)t.hasReader(l[L])||t.addColumnReader(void 0,l[L]);F.push(t);Q++});q=x.seriesTypes[B||"line"].prototype.pointArrayMap;void 0===q&&(q=["y"]);this.valueCount={global:N(B),xColumns:t,individual:A,seriesBuilders:F,globalPointArrayMap:q}},dataFound:function(){this.options.switchRowsAndColumns&&(this.columns=this.rowsToColumns(this.columns));this.getColumnDistribution();this.parseTypes();!1!==this.parsed()&&this.complete()},parseCSV:function(){var m=this,
q=this.options,t=q.csv,x=this.columns,B=q.startRow||0,A=q.endRow||Number.MAX_VALUE,F=q.startColumn||0,Q=q.endColumn||Number.MAX_VALUE,L,V,T=0;t&&(V=t.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split(q.lineDelimiter||"\n"),L=q.itemDelimiter||(-1!==t.indexOf("\t")?"\t":","),J(V,function(q,r){var l=m.trim(q),t=0===l.indexOf("#");r>=B&&r<=A&&!t&&""!==l&&(l=q.split(L),J(l,function(l,r){r>=F&&r<=Q&&(x[r-F]||(x[r-F]=[]),x[r-F][T]=l)}),T+=1)}),this.dataFound())},parseTable:function(){var m=this.options,q=
m.table,t=this.columns,x=m.startRow||0,B=m.endRow||Number.MAX_VALUE,A=m.startColumn||0,F=m.endColumn||Number.MAX_VALUE;q&&("string"===typeof q&&(q=document.getElementById(q)),J(q.getElementsByTagName("tr"),function(m,q){q>=x&&q<=B&&J(m.children,function(m,B){("TD"===m.tagName||"TH"===m.tagName)&&B>=A&&B<=F&&(t[B-A]||(t[B-A]=[]),t[B-A][q-x]=m.innerHTML)})}),this.dataFound())},parseGoogleSpreadsheet:function(){var m=this,q=this.options,t=q.googleSpreadsheetKey,x=this.columns,B=q.startRow||0,A=q.endRow||
Number.MAX_VALUE,F=q.startColumn||0,Q=q.endColumn||Number.MAX_VALUE,L,J;t&&jQuery.ajax({dataType:"json",url:"https://spreadsheets.google.com/feeds/cells/"+t+"/"+(q.googleSpreadsheetWorksheet||"od6")+"/public/values?alt=json-in-script&callback=?",error:q.error,success:function(q){q=q.feed.entry;var t,r=q.length,l=0,K=0,D;for(D=0;D<r;D++)t=q[D],l=Math.max(l,t.gs$cell.col),K=Math.max(K,t.gs$cell.row);for(D=0;D<l;D++)D>=F&&D<=Q&&(x[D-F]=[],x[D-F].length=Math.min(K,A-B));for(D=0;D<r;D++)t=q[D],L=t.gs$cell.row-
1,J=t.gs$cell.col-1,J>=F&&J<=Q&&L>=B&&L<=A&&(x[J-F][L-B]=t.content.$t);m.dataFound()}})},trim:function(m,q){"string"===typeof m&&(m=m.replace(/^\s+|\s+$/g,""),q&&/^[0-9\s]+$/.test(m)&&(m=m.replace(/\s/g,"")),this.decimalRegex&&(m=m.replace(this.decimalRegex,"$1.$2")));return m},parseTypes:function(){for(var m=this.columns,q=m.length;q--;)this.parseColumn(m[q],q)},parseColumn:function(m,q){var t=this.rawColumns,x=this.columns,B=m.length,A,F,Q,L,J=this.firstRowAsNames,T=-1!==ga(q,this.valueCount.xColumns),
G=[],r=this.chartOptions,l,K=(this.options.columnTypes||[])[q],r=T&&(r&&r.xAxis&&"category"===aa(r.xAxis)[0].type||"string"===K);for(t[q]||(t[q]=[]);B--;)A=G[B]||m[B],Q=this.trim(A),L=this.trim(A,!0),F=parseFloat(L),void 0===t[q][B]&&(t[q][B]=Q),r||0===B&&J?m[B]=Q:+L===F?(m[B]=F,31536E6<F&&"float"!==K?m.isDatetime=!0:m.isNumeric=!0,void 0!==m[B+1]&&(l=F>m[B+1])):(F=this.parseDate(A),T&&"number"===typeof F&&!isNaN(F)&&"float"!==K?(G[B]=A,m[B]=F,m.isDatetime=!0,void 0!==m[B+1]&&(A=F>m[B+1],A!==l&&void 0!==
l&&(this.alternativeFormat?(this.dateFormat=this.alternativeFormat,B=m.length,this.alternativeFormat=this.dateFormats[this.dateFormat].alternative):m.unsorted=!0),l=A)):(m[B]=""===Q?null:Q,0!==B&&(m.isDatetime||m.isNumeric)&&(m.mixed=!0)));T&&m.mixed&&(x[q]=t[q]);if(T&&l&&this.options.sort)for(q=0;q<x.length;q++)x[q].reverse(),J&&x[q].unshift(x[q].pop())},dateFormats:{"YYYY-mm-dd":{regex:/^([0-9]{4})[\-\/\.]([0-9]{2})[\-\/\.]([0-9]{2})$/,parser:function(m){return Date.UTC(+m[1],m[2]-1,+m[3])}},"dd/mm/YYYY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,
parser:function(m){return Date.UTC(+m[3],m[2]-1,+m[1])},alternative:"mm/dd/YYYY"},"mm/dd/YYYY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,parser:function(m){return Date.UTC(+m[3],m[1]-1,+m[2])}},"dd/mm/YY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,parser:function(m){return Date.UTC(+m[3]+2E3,m[2]-1,+m[1])},alternative:"mm/dd/YY"},"mm/dd/YY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,parser:function(m){return Date.UTC(+m[3]+2E3,m[1]-1,+m[2])}}},
parseDate:function(m){var q=this.options.parseDate,t,x,B=this.options.dateFormat||this.dateFormat,A;if(q)t=q(m);else if("string"===typeof m){if(B)q=this.dateFormats[B],(A=m.match(q.regex))&&(t=q.parser(A));else for(x in this.dateFormats)if(q=this.dateFormats[x],A=m.match(q.regex)){this.dateFormat=x;this.alternativeFormat=q.alternative;t=q.parser(A);break}A||(A=Date.parse(m),"object"===typeof A&&null!==A&&A.getTime?t=A.getTime()-6E4*A.getTimezoneOffset():"number"!==typeof A||isNaN(A)||(t=A-6E4*(new Date(A)).getTimezoneOffset()))}return t},
rowsToColumns:function(m){var q,t,x,B,A;if(m)for(A=[],t=m.length,q=0;q<t;q++)for(B=m[q].length,x=0;x<B;x++)A[x]||(A[x]=[]),A[x][q]=m[q][x];return A},parsed:function(){if(this.options.parsed)return this.options.parsed.call(this,this.columns)},getFreeIndexes:function(m,q){var t,x,B=[],A=[],F;for(x=0;x<m;x+=1)B.push(!0);for(t=0;t<q.length;t+=1)for(F=q[t].getReferencedColumnIndexes(),x=0;x<F.length;x+=1)B[F[x]]=!1;for(x=0;x<B.length;x+=1)B[x]&&A.push(x);return A},complete:function(){var m=this.columns,
q,t=this.options,x,B,A,F,J=[],L;if(t.complete||t.afterComplete){for(A=0;A<m.length;A++)this.firstRowAsNames&&(m[A].name=m[A].shift());x=[];B=this.getFreeIndexes(m.length,this.valueCount.seriesBuilders);for(A=0;A<this.valueCount.seriesBuilders.length;A++)L=this.valueCount.seriesBuilders[A],L.populateColumns(B)&&J.push(L);for(;0<B.length;){L=new V;L.addColumnReader(0,"x");A=ga(0,B);-1!==A&&B.splice(A,1);for(A=0;A<this.valueCount.global;A++)L.addColumnReader(void 0,this.valueCount.globalPointArrayMap[A]);
L.populateColumns(B)&&J.push(L)}0<J.length&&0<J[0].readers.length&&(L=m[J[0].readers[0].columnIndex],void 0!==L&&(L.isDatetime?q="datetime":L.isNumeric||(q="category")));if("category"===q)for(A=0;A<J.length;A++)for(L=J[A],B=0;B<L.readers.length;B++)"x"===L.readers[B].configName&&(L.readers[B].configName="name");for(A=0;A<J.length;A++){L=J[A];B=[];for(F=0;F<m[0].length;F++)B[F]=L.read(m,F);x[A]={data:B};L.name&&(x[A].name=L.name);"category"===q&&(x[A].turboThreshold=0)}m={series:x};q&&(m.xAxis={type:q});
t.complete&&t.complete(m);t.afterComplete&&t.afterComplete(m)}}});x.Data=oa;x.data=function(m,q){return new oa(m,q)};x.wrap(x.Chart.prototype,"init",function(m,q,t){var J=this;q&&q.data?x.data(x.extend(q.data,{afterComplete:function(B){var A,F;if(q.hasOwnProperty("series"))if("object"===typeof q.series)for(A=Math.max(q.series.length,B.series.length);A--;)F=q.series[A]||{},q.series[A]=x.merge(F,B.series[A]);else delete q.series;q=x.merge(B,q);m.call(J,q,t)}}),q):m.call(J,q,t)});V=function(){this.readers=
[];this.pointIsArray=!0};V.prototype.populateColumns=function(m){var q=!0;J(this.readers,function(q){void 0===q.columnIndex&&(q.columnIndex=m.shift())});J(this.readers,function(m){void 0===m.columnIndex&&(q=!1)});return q};V.prototype.read=function(m,q){var t=this.pointIsArray,x=t?[]:{},B;J(this.readers,function(A){var B=m[A.columnIndex][q];t?x.push(B):x[A.configName]=B});void 0===this.name&&2<=this.readers.length&&(B=this.getReferencedColumnIndexes(),2<=B.length&&(B.shift(),B.sort(),this.name=m[B.shift()].name));
return x};V.prototype.addColumnReader=function(m,q){this.readers.push({columnIndex:m,configName:q});"x"!==q&&"y"!==q&&void 0!==q&&(this.pointIsArray=!1)};V.prototype.getReferencedColumnIndexes=function(){var m,q=[],t;for(m=0;m<this.readers.length;m+=1)t=this.readers[m],void 0!==t.columnIndex&&q.push(t.columnIndex);return q};V.prototype.hasReader=function(m){var q,t;for(q=0;q<this.readers.length;q+=1)if(t=this.readers[q],t.configName===m)return!0}})(Highcharts);
(function(x){function J(m,r,l){var q;r.rgba.length&&m.rgba.length?(m=m.rgba,r=r.rgba,q=1!==r[3]||1!==m[3],m=(q?"rgba(":"rgb(")+Math.round(r[0]+(m[0]-r[0])*(1-l))+","+Math.round(r[1]+(m[1]-r[1])*(1-l))+","+Math.round(r[2]+(m[2]-r[2])*(1-l))+(q?","+(r[3]+(m[3]-r[3])*(1-l)):"")+")"):m=r.raw||"none";return m}var ja=function(){},ga=x.getOptions(),aa=x.each,V=x.extend,oa=x.format,m=x.pick,q=x.wrap,t=x.Chart,N=x.seriesTypes,B=N.pie,A=N.column,F=x.Tick,Q=HighchartsAdapter.fireEvent,L=HighchartsAdapter.inArray,
ua=1;aa(["fill","stroke"],function(m){HighchartsAdapter.addAnimSetter(m,function(r){r.elem.attr(m,J(x.Color(r.start),x.Color(r.end),r.pos))})});V(ga.lang,{drillUpText:"\u25c1 Back to {series.name}"});ga.drilldown={activeAxisLabelStyle:{cursor:"pointer",color:"#0d233a",fontWeight:"bold",textDecoration:"underline"},activeDataLabelStyle:{cursor:"pointer",color:"#0d233a",fontWeight:"bold",textDecoration:"underline"},animation:{duration:500},drillUpButton:{position:{align:"right",x:-10,y:10}}};x.SVGRenderer.prototype.Element.prototype.fadeIn=
function(q){this.attr({opacity:.1,visibility:"inherit"}).animate({opacity:m(this.newOpacity,1)},q||{duration:250})};t.prototype.addSeriesAsDrilldown=function(m,r){this.addSingleSeriesAsDrilldown(m,r);this.applyDrilldown()};t.prototype.addSingleSeriesAsDrilldown=function(m,r){var l=m.series,q=l.xAxis,t=l.yAxis,x;x=m.color||l.color;var A,B=[],C=[],F,J;this.drilldownLevels||(this.drilldownLevels=[]);F=l.options._levelNumber||0;(J=this.drilldownLevels[this.drilldownLevels.length-1])&&J.levelNumber!==
F&&(J=void 0);r=V({color:x,_ddSeriesId:ua++},r);A=L(m,l.points);aa(l.chart.series,function(l){l.xAxis!==q||l.isDrilling||(l.options._ddSeriesId=l.options._ddSeriesId||ua++,l.options._colorIndex=l.userOptions._colorIndex,l.options._levelNumber=l.options._levelNumber||F,J?(B=J.levelSeries,C=J.levelSeriesOptions):(B.push(l),C.push(l.options)))});x={levelNumber:F,seriesOptions:l.options,levelSeriesOptions:C,levelSeries:B,shapeArgs:m.shapeArgs,bBox:m.graphic?m.graphic.getBBox():{},color:x,lowerSeriesOptions:r,
pointOptions:l.options.data[A],pointIndex:A,oldExtremes:{xMin:q&&q.userMin,xMax:q&&q.userMax,yMin:t&&t.userMin,yMax:t&&t.userMax}};this.drilldownLevels.push(x);x=x.lowerSeries=this.addSeries(r,!1);x.options._levelNumber=F+1;q&&(q.oldPos=q.pos,q.userMin=q.userMax=null,t.userMin=t.userMax=null);l.type===x.type&&(x.animate=x.animateDrilldown||ja,x.options.animation=!0)};t.prototype.applyDrilldown=function(){var m=this.drilldownLevels,r;m&&0<m.length&&(r=m[m.length-1].levelNumber,aa(this.drilldownLevels,
function(l){l.levelNumber===r&&aa(l.levelSeries,function(l){l.options&&l.options._levelNumber===r&&l.remove(!1)})}));this.redraw();this.showDrillUpButton()};t.prototype.getDrilldownBackText=function(){var m=this.drilldownLevels;if(m&&0<m.length)return m=m[m.length-1],m.series=m.seriesOptions,oa(this.options.lang.drillUpText,m)};t.prototype.showDrillUpButton=function(){var m=this,r=this.getDrilldownBackText(),l=m.options.drilldown.drillUpButton,q,t;this.drillUpButton?this.drillUpButton.attr({text:r}).align():
(t=(q=l.theme)&&q.states,this.drillUpButton=this.renderer.button(r,null,null,function(){m.drillUp()},q,t&&t.hover,t&&t.select).attr({align:l.position.align,zIndex:9}).add().align(l.position,!1,l.relativeTo||"plotBox"))};t.prototype.drillUp=function(){for(var m=this,r=m.drilldownLevels,l=r[r.length-1].levelNumber,q=r.length,t=m.series,x,A,B,C,F=function(l){var r;aa(t,function(m){m.options._ddSeriesId===l._ddSeriesId&&(r=m)});r=r||m.addSeries(l,!1);r.type===B.type&&r.animateDrillupTo&&(r.animate=r.animateDrillupTo);
l===A.seriesOptions&&(C=r)};q--;)if(A=r[q],A.levelNumber===l){r.pop();B=A.lowerSeries;if(!B.chart)for(x=t.length;x--;)if(t[x].options.id===A.lowerSeriesOptions.id&&t[x].options._levelNumber===l+1){B=t[x];break}B.xData=[];aa(A.levelSeriesOptions,F);Q(m,"drillup",{seriesOptions:A.seriesOptions});C.type===B.type&&(C.drilldownLevel=A,C.options.animation=m.options.drilldown.animation,B.animateDrillupFrom&&B.chart&&B.animateDrillupFrom(A));C.options._levelNumber=l;B.remove(!1);C.xAxis&&(x=A.oldExtremes,
C.xAxis.setExtremes(x.xMin,x.xMax,!1),C.yAxis.setExtremes(x.yMin,x.yMax,!1))}this.redraw();0===this.drilldownLevels.length?this.drillUpButton=this.drillUpButton.destroy():this.drillUpButton.attr({text:this.getDrilldownBackText()}).align();this.ddDupes.length=[]};A.prototype.supportsDrilldown=!0;A.prototype.animateDrillupTo=function(m){if(!m){var r=this,l=r.drilldownLevel;aa(this.points,function(l){l.graphic&&l.graphic.hide();l.dataLabel&&l.dataLabel.hide();l.connector&&l.connector.hide()});setTimeout(function(){r.points&&
aa(r.points,function(m,r){var q=r===(l&&l.pointIndex)?"show":"fadeIn",t="show"===q?!0:void 0;if(m.graphic)m.graphic[q](t);if(m.dataLabel)m.dataLabel[q](t);if(m.connector)m.connector[q](t)})},Math.max(this.chart.options.drilldown.animation.duration-50,0));this.animate=ja}};A.prototype.animateDrilldown=function(q){var r=this,l=this.chart.drilldownLevels,t,x=this.chart.options.drilldown.animation,A=this.xAxis;q||(aa(l,function(l){r.options._ddSeriesId===l.lowerSeriesOptions._ddSeriesId&&(t=l.shapeArgs,
t.fill=l.color)}),t.x+=m(A.oldPos,A.pos)-A.pos,aa(this.points,function(l){l.graphic&&l.graphic.attr(t).animate(V(l.shapeArgs,{fill:l.color}),x);l.dataLabel&&l.dataLabel.fadeIn(x)}),this.animate=null)};A.prototype.animateDrillupFrom=function(m){var r=this.chart.options.drilldown.animation,l=this.group,q=this;aa(q.trackerGroups,function(l){if(q[l])q[l].on("mouseover")});delete this.group;aa(this.points,function(q){var t=q.graphic,A=function(){t.destroy();l&&(l=l.destroy())};t&&(delete q.graphic,r?t.animate(V(m.shapeArgs,
{fill:m.color}),x.merge(r,{complete:A})):(t.attr(m.shapeArgs),A()))})};B&&V(B.prototype,{supportsDrilldown:!0,animateDrillupTo:A.prototype.animateDrillupTo,animateDrillupFrom:A.prototype.animateDrillupFrom,animateDrilldown:function(m){var r=this.chart.drilldownLevels[this.chart.drilldownLevels.length-1],l=this.chart.options.drilldown.animation,q=r.shapeArgs,t=q.start,A=(q.end-t)/this.points.length;m||(aa(this.points,function(m,B){m.graphic.attr(x.merge(q,{start:t+B*A,end:t+(B+1)*A,fill:r.color}))[l?
"animate":"attr"](V(m.shapeArgs,{fill:m.color}),l)}),this.animate=null)}});x.Point.prototype.doDrilldown=function(m,r){var l=this.series.chart,q=l.options.drilldown,t=(q.series||[]).length,x;l.ddDupes||(l.ddDupes=[]);for(;t--&&!x;)q.series[t].id===this.drilldown&&-1===L(this.drilldown,l.ddDupes)&&(x=q.series[t],l.ddDupes.push(this.drilldown));Q(l,"drilldown",{point:this,seriesOptions:x,category:r,points:void 0!==r&&this.series.xAxis.ddPoints[r].slice(0)});x&&(m?l.addSingleSeriesAsDrilldown(this,x):
l.addSeriesAsDrilldown(this,x))};x.Axis.prototype.drilldownCategory=function(m){var r,l,q=this.ddPoints[m];for(r in q)(l=q[r])&&l.series&&l.series.visible&&l.doDrilldown&&l.doDrilldown(!0,m);this.chart.applyDrilldown()};x.Axis.prototype.getDDPoints=function(m,r){var l=this.ddPoints;l||(this.ddPoints=l={});l[m]||(l[m]=[]);l[m].levelNumber!==r&&(l[m].length=0);return l[m]};F.prototype.drillable=function(){var m=this.pos,r=this.label,l=this.axis,q=l.ddPoints&&l.ddPoints[m];r&&q&&q.length?(r.basicStyles||
(r.basicStyles=x.merge(r.styles)),r.addClass("highcharts-drilldown-axis-label").css(l.chart.options.drilldown.activeAxisLabelStyle).on("click",function(){l.drilldownCategory(m)})):r&&r.basicStyles&&(r.styles={},r.css(r.basicStyles),r.on("click",null))};q(F.prototype,"addLabel",function(m){m.call(this);this.drillable()});q(x.Point.prototype,"init",function(m,r,l,q){var t=m.call(this,r,l,q);m=(l=r.xAxis)&&l.ticks[q];l=l&&l.getDDPoints(q,r.options._levelNumber);t.drilldown&&(x.addEvent(t,"click",function(){r.xAxis&&
!1===r.chart.options.drilldown.allowPointDrilldown?r.xAxis.drilldownCategory(q):t.doDrilldown()}),l&&(l.push(t),l.levelNumber=r.options._levelNumber));m&&m.drillable();return t});q(x.Series.prototype,"drawDataLabels",function(m){var r=this.chart.options.drilldown.activeDataLabelStyle;m.call(this);aa(this.points,function(l){l.drilldown&&l.dataLabel&&l.dataLabel.attr({"class":"highcharts-drilldown-data-label"}).css(r)})});var T,ga=function(m){m.call(this);aa(this.points,function(m){m.drilldown&&m.graphic&&
m.graphic.attr({"class":"highcharts-drilldown-point"}).css({cursor:"pointer"})})};for(T in N)N[T].prototype.supportsDrilldown&&q(N[T].prototype,"drawTracker",ga)})(Highcharts);
/*
 Highcharts JS v3.0.2 (2013-06-05)
 Exporting module

 (c) 2010-2013 Torstein Hønsi

 License: www.highcharts.com/license
*/

(function(e){var y=e.Chart,v=e.addEvent,B=e.removeEvent,m=e.createElement,j=e.discardElement,t=e.css,k=e.merge,r=e.each,p=e.extend,C=Math.max,i=document,z=window,D=e.isTouchDevice,E=e.Renderer.prototype.symbols,s=e.getOptions(),w;p(s.lang,{printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",contextButtonTitle:"Chart context menu"});s.navigation={menuStyle:{border:"1px solid #A0A0A0",
background:"#FFFFFF",padding:"5px 0"},menuItemStyle:{padding:"0 10px",background:"none",color:"#303030",fontSize:D?"14px":"11px"},menuItemHoverStyle:{background:"#4572A5",color:"#FFFFFF"},buttonOptions:{symbolFill:"#E0E0E0",symbolSize:14,symbolStroke:"#666",symbolStrokeWidth:3,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,theme:{fill:"white",stroke:"none"},verticalAlign:"top",width:24}};s.exporting={type:"image/png",url:"http://export.highcharts.com/",buttons:{contextButton:{symbol:"menu",
_titleKey:"contextButtonTitle",menuItems:[{textKey:"printChart",onclick:function(){this.print()}},{separator:!0},{textKey:"downloadPNG",onclick:function(){this.exportChart()}},{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}]}}};e.post=function(a,b){var c,d;d=m("form",{method:"post",action:a,enctype:"multipart/form-data"},
{display:"none"},i.body);for(c in b)m("input",{type:"hidden",name:c,value:b[c]},null,d);d.submit();j(d)};p(y.prototype,{getSVG:function(a){var b=this,c,d,x,g,f=k(b.options,a);if(!i.createElementNS)i.createElementNS=function(a,b){return i.createElement(b)};a=m("div",null,{position:"absolute",top:"-9999em",width:b.chartWidth+"px",height:b.chartHeight+"px"},i.body);d=b.renderTo.style.width;g=b.renderTo.style.height;d=f.exporting.sourceWidth||f.chart.width||/px$/.test(d)&&parseInt(d,10)||600;g=f.exporting.sourceHeight||
f.chart.height||/px$/.test(g)&&parseInt(g,10)||400;p(f.chart,{animation:!1,renderTo:a,forExport:!0,width:d,height:g});f.exporting.enabled=!1;f.series=[];r(b.series,function(a){x=k(a.options,{animation:!1,showCheckbox:!1,visible:a.visible});x.isInternal||f.series.push(x)});c=new e.Chart(f,b.callback);r(["xAxis","yAxis"],function(a){r(b[a],function(b,d){var f=c[a][d],e=b.getExtremes(),g=e.userMin,e=e.userMax;(g!==void 0||e!==void 0)&&f.setExtremes(g,e,!0,!1)})});d=c.container.innerHTML;f=null;c.destroy();
j(a);d=d.replace(/zIndex="[^"]+"/g,"").replace(/isShadow="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,'<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ href=/g," xlink:href=").replace(/\n/," ").replace(/<\/svg>.*?$/,"</svg>").replace(/&nbsp;/g," ").replace(/&shy;/g,"­").replace(/<IMG /g,"<image ").replace(/height=([^" ]+)/g,'height="$1"').replace(/width=([^" ]+)/g,'width="$1"').replace(/hc-svg-href="([^"]+)">/g,
'xlink:href="$1"/>').replace(/id=([^" >]+)/g,'id="$1"').replace(/class=([^" >]+)/g,'class="$1"').replace(/ transform /g," ").replace(/:(path|rect)/g,"$1").replace(/style="([^"]+)"/g,function(a){return a.toLowerCase()});d=d.replace(/(url\(#highcharts-[0-9]+)&quot;/g,"$1").replace(/&quot;/g,"'");d.match(/ xmlns="/g).length===2&&(d=d.replace(/xmlns="[^"]+"/,""));return d},exportChart:function(a,b){var a=a||{},c=this.options.exporting,c=this.getSVG(k({chart:{borderRadius:0}},c.chartOptions,b,{exporting:{sourceWidth:a.sourceWidth||
c.sourceWidth,sourceHeight:a.sourceHeight||c.sourceHeight}})),a=k(this.options.exporting,a);e.post(a.url,{filename:a.filename||"chart",type:a.type,width:a.width||0,scale:a.scale||2,svg:c})},print:function(){var a=this,b=a.container,c=[],d=b.parentNode,e=i.body,g=e.childNodes;if(!a.isPrinting)a.isPrinting=!0,r(g,function(a,b){if(a.nodeType===1)c[b]=a.style.display,a.style.display="none"}),e.appendChild(b),z.focus(),z.print(),setTimeout(function(){d.appendChild(b);r(g,function(a,b){if(a.nodeType===
1)a.style.display=c[b]});a.isPrinting=!1},1E3)},contextMenu:function(a,b,c,d,e,g,f){var h=this,q=h.options.navigation,n=q.menuItemStyle,o=h.chartWidth,i=h.chartHeight,A="cache-"+a,l=h[A],k=C(e,g),u,j,s;if(!l)h[A]=l=m("div",{className:"highcharts-"+a},{position:"absolute",zIndex:1E3,padding:k+"px"},h.container),u=m("div",null,p({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},q.menuStyle),l),j=function(){t(l,{display:"none"});f&&f.setState(0);h.openMenu=
!1},v(l,"mouseleave",function(){s=setTimeout(j,500)}),v(l,"mouseenter",function(){clearTimeout(s)}),r(b,function(a){if(a){var b=a.separator?m("hr",null,null,u):m("div",{onmouseover:function(){t(this,q.menuItemHoverStyle)},onmouseout:function(){t(this,n)},onclick:function(){j();a.onclick.apply(h,arguments)},innerHTML:a.text||h.options.lang[a.textKey]},p({cursor:"pointer"},n),u);h.exportDivElements.push(b)}}),h.exportDivElements.push(u,l),h.exportMenuWidth=l.offsetWidth,h.exportMenuHeight=l.offsetHeight;
a={display:"block"};c+h.exportMenuWidth>o?a.right=o-c-e-k+"px":a.left=c-k+"px";d+g+h.exportMenuHeight>i?a.bottom=i-d-k+"px":a.top=d+g-k+"px";t(l,a);h.openMenu=!0},addButton:function(a){var b=this,c=b.renderer,a=k(b.options.navigation.buttonOptions,a),d=a.onclick,i=a.menuItems,g,f,h={stroke:a.symbolStroke,fill:a.symbolFill},q=a.symbolSize||12;if(!b.btnCount)b.btnCount=0;b.btnCount++;if(!b.exportDivElements)b.exportDivElements=[],b.exportSVGElements=[];if(a.enabled!==!1){var n=a.theme,o=n.states,m=
o&&o.hover,o=o&&o.select,j;delete n.states;d?j=function(){d.apply(b,arguments)}:i&&(j=function(){b.contextMenu("contextmenu",i,f.translateX,f.translateY,f.width,f.height,f);f.setState(2)});a.text&&a.symbol?n.paddingLeft=e.pick(n.paddingLeft,25):a.text||p(n,{width:a.width,height:a.height,padding:0});f=c.button(a.text,0,0,j,n,m,o).attr({title:b.options.lang[a._titleKey],"stroke-linecap":"round"});a.symbol&&(g=c.symbol(a.symbol,a.symbolX-q/2,a.symbolY-q/2,q,q).attr(p(h,{"stroke-width":a.symbolStrokeWidth||
1,zIndex:1})).add(f));f.add().align(p(a,{width:f.width,x:e.pick(a.x,w)}),!0,"spacingBox");w+=(f.width+a.buttonSpacing)*(a.align==="right"?-1:1);b.exportSVGElements.push(f,g)}},destroyExport:function(a){var a=a.target,b,c;for(b=0;b<a.exportSVGElements.length;b++)if(c=a.exportSVGElements[b])c.onclick=c.ontouchstart=null,a.exportSVGElements[b]=c.destroy();for(b=0;b<a.exportDivElements.length;b++)c=a.exportDivElements[b],B(c,"mouseleave"),a.exportDivElements[b]=c.onmouseout=c.onmouseover=c.ontouchstart=
c.onclick=null,j(c)}});E.menu=function(a,b,c,d){return["M",a,b+2.5,"L",a+c,b+2.5,"M",a,b+d/2+0.5,"L",a+c,b+d/2+0.5,"M",a,b+d-1.5,"L",a+c,b+d-1.5]};y.prototype.callbacks.push(function(a){var b,c=a.options.exporting,d=c.buttons;w=0;if(c.enabled!==!1){for(b in d)a.addButton(d[b]);v(a,"destroy",a.destroyExport)}})})(Highcharts);
/*
 Highcharts JS v3.0.2 (2013-06-05)

 (c) 2009-2013 Torstein Hønsi

 License: www.highcharts.com/license
*/

(function(k,F){function K(a,b,c){this.init.call(this,a,b,c)}function L(a,b,c){a.call(this,b,c);if(this.chart.polar)this.closeSegment=function(a){var c=this.xAxis.center;a.push("L",c[0],c[1])},this.closedStacks=!0}function M(a,b){var c=this.chart,d=this.options.animation,e=this.group,f=this.markerGroup,g=this.xAxis.center,j=c.plotLeft,l=c.plotTop;if(c.polar){if(c.renderer.isSVG)if(d===!0&&(d={}),b){if(c={translateX:g[0]+j,translateY:g[1]+l,scaleX:0.001,scaleY:0.001},e.attr(c),f)f.attrSetters=e.attrSetters,
f.attr(c)}else c={translateX:j,translateY:l,scaleX:1,scaleY:1},e.animate(c,d),f&&f.animate(c,d),this.animate=null}else a.call(this,b)}var Q=k.arrayMin,R=k.arrayMax,r=k.each,H=k.extend,m=k.merge,S=k.map,q=k.pick,x=k.pInt,n=k.getOptions().plotOptions,h=k.seriesTypes,A=k.extendClass,N=k.splat,p=k.wrap,O=k.Axis,v=k.Tick,B=k.Series,y=h.column.prototype,u=Math,I=u.round,C=u.floor,J=u.ceil,T=u.min,U=u.max,t=function(){};H(K.prototype,{init:function(a,b,c){var d=this,e=d.defaultOptions;d.chart=b;if(b.angular)e.background=
{};d.options=a=m(e,a);(a=a.background)&&r([].concat(N(a)).reverse(),function(a){var b=a.backgroundColor,a=m(d.defaultBackgroundOptions,a);if(b)a.backgroundColor=b;a.color=a.backgroundColor;c.options.plotBands.unshift(a)})},defaultOptions:{center:["50%","50%"],size:"85%",startAngle:0},defaultBackgroundOptions:{shape:"circle",borderWidth:1,borderColor:"silver",backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#FFF"],[1,"#DDD"]]},from:Number.MIN_VALUE,innerRadius:0,to:Number.MAX_VALUE,
outerRadius:"105%"}});var G=O.prototype,v=v.prototype,V={getOffset:t,redraw:function(){this.isDirty=!1},render:function(){this.isDirty=!1},setScale:t,setCategories:t,setTitle:t},P={isRadial:!0,defaultRadialGaugeOptions:{labels:{align:"center",x:0,y:null},minorGridLineWidth:0,minorTickInterval:"auto",minorTickLength:10,minorTickPosition:"inside",minorTickWidth:1,plotBands:[],tickLength:10,tickPosition:"inside",tickWidth:2,title:{rotation:0},zIndex:2},defaultRadialXOptions:{gridLineWidth:1,labels:{align:null,
distance:15,x:0,y:null},maxPadding:0,minPadding:0,plotBands:[],showLastLabel:!1,tickLength:0},defaultRadialYOptions:{gridLineInterpolation:"circle",labels:{align:"right",x:-3,y:-2},plotBands:[],showLastLabel:!1,title:{x:4,text:null,rotation:90}},setOptions:function(a){this.options=m(this.defaultOptions,this.defaultRadialOptions,a)},getOffset:function(){G.getOffset.call(this);this.chart.axisOffset[this.side]=0;this.center=this.pane.center=h.pie.prototype.getCenter.call(this.pane)},getLinePath:function(a,
b){var c=this.center,b=q(b,c[2]/2-this.offset);return this.chart.renderer.symbols.arc(this.left+c[0],this.top+c[1],b,b,{start:this.startAngleRad,end:this.endAngleRad,open:!0,innerR:0})},setAxisTranslation:function(){G.setAxisTranslation.call(this);if(this.center&&(this.transA=this.isCircular?(this.endAngleRad-this.startAngleRad)/(this.max-this.min||1):this.center[2]/2/(this.max-this.min||1),this.isXAxis))this.minPixelPadding=this.transA*this.minPointOffset+(this.reversed?(this.endAngleRad-this.startAngleRad)/
4:0)},beforeSetTickPositions:function(){this.autoConnect&&(this.max+=this.categories&&1||this.pointRange||this.closestPointRange)},setAxisSize:function(){G.setAxisSize.call(this);if(this.center)this.len=this.width=this.height=this.isCircular?this.center[2]*(this.endAngleRad-this.startAngleRad)/2:this.center[2]/2},getPosition:function(a,b){if(!this.isCircular)b=this.translate(a),a=this.min;return this.postTranslate(this.translate(a),q(b,this.center[2]/2)-this.offset)},postTranslate:function(a,b){var c=
this.chart,d=this.center,a=this.startAngleRad+a;return{x:c.plotLeft+d[0]+Math.cos(a)*b,y:c.plotTop+d[1]+Math.sin(a)*b}},getPlotBandPath:function(a,b,c){var d=this.center,e=this.startAngleRad,f=d[2]/2,g=[q(c.outerRadius,"100%"),c.innerRadius,q(c.thickness,10)],j=/%$/,l,o=this.isCircular;this.options.gridLineInterpolation==="polygon"?d=this.getPlotLinePath(a).concat(this.getPlotLinePath(b,!0)):(o||(g[0]=this.translate(a),g[1]=this.translate(b)),g=S(g,function(a){j.test(a)&&(a=x(a,10)*f/100);return a}),
c.shape==="circle"||!o?(a=-Math.PI/2,b=Math.PI*1.5,l=!0):(a=e+this.translate(a),b=e+this.translate(b)),d=this.chart.renderer.symbols.arc(this.left+d[0],this.top+d[1],g[0],g[0],{start:a,end:b,innerR:q(g[1],g[0]-g[2]),open:l}));return d},getPlotLinePath:function(a,b){var c=this.center,d=this.chart,e=this.getPosition(a),f,g,j;this.isCircular?j=["M",c[0]+d.plotLeft,c[1]+d.plotTop,"L",e.x,e.y]:this.options.gridLineInterpolation==="circle"?(a=this.translate(a))&&(j=this.getLinePath(0,a)):(f=d.xAxis[0],
j=[],a=this.translate(a),c=f.tickPositions,f.autoConnect&&(c=c.concat([c[0]])),b&&(c=[].concat(c).reverse()),r(c,function(c,b){g=f.getPosition(c,a);j.push(b?"L":"M",g.x,g.y)}));return j},getTitlePosition:function(){var a=this.center,b=this.chart,c=this.options.title;return{x:b.plotLeft+a[0]+(c.x||0),y:b.plotTop+a[1]-{high:0.5,middle:0.25,low:0}[c.align]*a[2]+(c.y||0)}}};p(G,"init",function(a,b,c){var i;var d=b.angular,e=b.polar,f=c.isX,g=d&&f,j,l;l=b.options;var o=c.pane||0;if(d){if(H(this,g?V:P),
j=!f)this.defaultRadialOptions=this.defaultRadialGaugeOptions}else if(e)H(this,P),this.defaultRadialOptions=(j=f)?this.defaultRadialXOptions:m(this.defaultYAxisOptions,this.defaultRadialYOptions);a.call(this,b,c);if(!g&&(d||e)){a=this.options;if(!b.panes)b.panes=[];this.pane=(i=b.panes[o]=b.panes[o]||new K(N(l.pane)[o],b,this),o=i);o=o.options;b.inverted=!1;l.chart.zoomType=null;this.startAngleRad=b=(o.startAngle-90)*Math.PI/180;this.endAngleRad=l=(q(o.endAngle,o.startAngle+360)-90)*Math.PI/180;this.offset=
a.offset||0;if((this.isCircular=j)&&c.max===F&&l-b===2*Math.PI)this.autoConnect=!0}});p(v,"getPosition",function(a,b,c,d,e){var f=this.axis;return f.getPosition?f.getPosition(c):a.call(this,b,c,d,e)});p(v,"getLabelPosition",function(a,b,c,d,e,f,g,j,l){var o=this.axis,i=f.y,h=f.align,k=(o.translate(this.pos)+o.startAngleRad+Math.PI/2)/Math.PI*180;o.isRadial?(a=o.getPosition(this.pos,o.center[2]/2+q(f.distance,-25)),f.rotation==="auto"?d.attr({rotation:k}):i===null&&(i=x(d.styles.lineHeight)*0.9-d.getBBox().height/
2),h===null&&(h=o.isCircular?k>20&&k<160?"left":k>200&&k<340?"right":"center":"center",d.attr({align:h})),a.x+=f.x,a.y+=i):a=a.call(this,b,c,d,e,f,g,j,l);return a});p(v,"getMarkPath",function(a,b,c,d,e,f,g){var j=this.axis;j.isRadial?(a=j.getPosition(this.pos,j.center[2]/2+d),b=["M",b,c,"L",a.x,a.y]):b=a.call(this,b,c,d,e,f,g);return b});n.arearange=m(n.area,{lineWidth:1,marker:null,threshold:null,tooltip:{pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.low}</b> - <b>{point.high}</b><br/>'},
trackByArea:!0,dataLabels:{verticalAlign:null,xLow:0,xHigh:0,yLow:0,yHigh:0}});h.arearange=k.extendClass(h.area,{type:"arearange",pointArrayMap:["low","high"],toYData:function(a){return[a.low,a.high]},pointValKey:"low",getSegments:function(){var a=this;r(a.points,function(b){if(!a.options.connectNulls&&(b.low===null||b.high===null))b.y=null;else if(b.low===null&&b.high!==null)b.y=b.high});B.prototype.getSegments.call(this)},translate:function(){var a=this.yAxis;h.area.prototype.translate.apply(this);
r(this.points,function(b){var c=b.low,d=b.high,e=b.plotY;d===null&&c===null?b.y=null:c===null?(b.plotLow=b.plotY=null,b.plotHigh=a.toPixels(d,!0)):d===null?(b.plotLow=e,b.plotHigh=null):(b.plotLow=e,b.plotHigh=a.toPixels(d,!0))})},getSegmentPath:function(a){var b,c=[],d=a.length,e=B.prototype.getSegmentPath,f,g;g=this.options;var j=g.step;for(b=HighchartsAdapter.grep(a,function(a){return a.plotLow!==null});d--;)f=a[d],f.plotHigh!==null&&c.push({plotX:f.plotX,plotY:f.plotHigh});a=e.call(this,b);if(j)j===
!0&&(j="left"),g.step={left:"right",center:"center",right:"left"}[j];c=e.call(this,c);g.step=j;g=[].concat(a,c);c[0]="L";this.areaPath=this.areaPath.concat(a,c);return g},drawDataLabels:function(){var a=this.data,b=a.length,c,d=[],e=B.prototype,f=this.options.dataLabels,g,j=this.chart.inverted;if(f.enabled||this._hasPointLabels){for(c=b;c--;)g=a[c],g.y=g.high,g.plotY=g.plotHigh,d[c]=g.dataLabel,g.dataLabel=g.dataLabelUpper,g.below=!1,j?(f.align="left",f.x=f.xHigh):f.y=f.yHigh;e.drawDataLabels.apply(this,
arguments);for(c=b;c--;)g=a[c],g.dataLabelUpper=g.dataLabel,g.dataLabel=d[c],g.y=g.low,g.plotY=g.plotLow,g.below=!0,j?(f.align="right",f.x=f.xLow):f.y=f.yLow;e.drawDataLabels.apply(this,arguments)}},alignDataLabel:h.column.prototype.alignDataLabel,getSymbol:h.column.prototype.getSymbol,drawPoints:t});n.areasplinerange=m(n.arearange);h.areasplinerange=A(h.arearange,{type:"areasplinerange",getPointSpline:h.spline.prototype.getPointSpline});n.columnrange=m(n.column,n.arearange,{lineWidth:1,pointRange:null});
h.columnrange=A(h.arearange,{type:"columnrange",translate:function(){var a=this.yAxis,b;y.translate.apply(this);r(this.points,function(c){var d=c.shapeArgs;c.plotHigh=b=a.translate(c.high,0,1,0,1);c.plotLow=c.plotY;d.y=b;d.height=c.plotY-b})},trackerGroups:["group","dataLabels"],drawGraph:t,pointAttrToOptions:y.pointAttrToOptions,drawPoints:y.drawPoints,drawTracker:y.drawTracker,animate:y.animate,getColumnMetrics:y.getColumnMetrics});n.gauge=m(n.line,{dataLabels:{enabled:!0,y:15,borderWidth:1,borderColor:"silver",
borderRadius:3,style:{fontWeight:"bold"},verticalAlign:"top",zIndex:2},dial:{},pivot:{},tooltip:{headerFormat:""},showInLegend:!1});v={type:"gauge",pointClass:k.extendClass(k.Point,{setState:function(a){this.state=a}}),angular:!0,drawGraph:t,trackerGroups:["group","dataLabels"],translate:function(){var a=this.yAxis,b=this.options,c=a.center;this.generatePoints();r(this.points,function(d){var e=m(b.dial,d.dial),f=x(q(e.radius,80))*c[2]/200,g=x(q(e.baseLength,70))*f/100,j=x(q(e.rearLength,10))*f/100,
l=e.baseWidth||3,o=e.topWidth||1,i=a.startAngleRad+a.translate(d.y,null,null,null,!0);b.wrap===!1&&(i=Math.max(a.startAngleRad,Math.min(a.endAngleRad,i)));i=i*180/Math.PI;d.shapeType="path";d.shapeArgs={d:e.path||["M",-j,-l/2,"L",g,-l/2,f,-o/2,f,o/2,g,l/2,-j,l/2,"z"],translateX:c[0],translateY:c[1],rotation:i};d.plotX=c[0];d.plotY=c[1]})},drawPoints:function(){var a=this,b=a.yAxis.center,c=a.pivot,d=a.options,e=d.pivot,f=a.chart.renderer;r(a.points,function(c){var b=c.graphic,e=c.shapeArgs,o=e.d,
i=m(d.dial,c.dial);b?(b.animate(e),e.d=o):c.graphic=f[c.shapeType](e).attr({stroke:i.borderColor||"none","stroke-width":i.borderWidth||0,fill:i.backgroundColor||"black",rotation:e.rotation}).add(a.group)});c?c.animate({translateX:b[0],translateY:b[1]}):a.pivot=f.circle(0,0,q(e.radius,5)).attr({"stroke-width":e.borderWidth||0,stroke:e.borderColor||"silver",fill:e.backgroundColor||"black"}).translate(b[0],b[1]).add(a.group)},animate:function(a){var b=this;if(!a)r(b.points,function(a){var d=a.graphic;
d&&(d.attr({rotation:b.yAxis.startAngleRad*180/Math.PI}),d.animate({rotation:a.shapeArgs.rotation},b.options.animation))}),b.animate=null},render:function(){this.group=this.plotGroup("group","series",this.visible?"visible":"hidden",this.options.zIndex,this.chart.seriesGroup);h.pie.prototype.render.call(this);this.group.clip(this.chart.clipRect)},setData:h.pie.prototype.setData,drawTracker:h.column.prototype.drawTracker};h.gauge=k.extendClass(h.line,v);n.boxplot=m(n.column,{fillColor:"#FFFFFF",lineWidth:1,
medianWidth:2,states:{hover:{brightness:-0.3}},threshold:null,tooltip:{pointFormat:'<span style="color:{series.color};font-weight:bold">{series.name}</span><br/>Minimum: {point.low}<br/>Lower quartile: {point.q1}<br/>Median: {point.median}<br/>Higher quartile: {point.q3}<br/>Maximum: {point.high}<br/>'},whiskerLength:"50%",whiskerWidth:2});h.boxplot=A(h.column,{type:"boxplot",pointArrayMap:["low","q1","median","q3","high"],toYData:function(a){return[a.low,a.q1,a.median,a.q3,a.high]},pointValKey:"high",
pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth"},drawDataLabels:t,translate:function(){var a=this.yAxis,b=this.pointArrayMap;h.column.prototype.translate.apply(this);r(this.points,function(c){r(b,function(b){c[b]!==null&&(c[b+"Plot"]=a.translate(c[b],0,1,0,1))})})},drawPoints:function(){var a=this,b=a.points,c=a.options,d=a.chart.renderer,e,f,g,j,l,o,i,h,k,n,s,E,p,w,m,u,y,t,x,v,B,A,z=a.doQuartiles!==!1,D=parseInt(a.options.whiskerLength,10)/100;r(b,function(b){k=b.graphic;
B=b.shapeArgs;s={};w={};u={};A=b.color||a.color;if(b.plotY!==F)if(e=b.pointAttr[b.selected?"selected":""],y=B.width,t=C(B.x),x=t+y,v=I(y/2),f=C(z?b.q1Plot:b.lowPlot),g=C(z?b.q3Plot:b.lowPlot),j=C(b.highPlot),l=C(b.lowPlot),s.stroke=b.stemColor||c.stemColor||A,s["stroke-width"]=q(b.stemWidth,c.stemWidth,c.lineWidth),s.dashstyle=b.stemDashStyle||c.stemDashStyle,w.stroke=b.whiskerColor||c.whiskerColor||A,w["stroke-width"]=q(b.whiskerWidth,c.whiskerWidth,c.lineWidth),u.stroke=b.medianColor||c.medianColor||
A,u["stroke-width"]=q(b.medianWidth,c.medianWidth,c.lineWidth),i=s["stroke-width"]%2/2,h=t+v+i,n=["M",h,g,"L",h,j,"M",h,f,"L",h,l,"z"],z&&(i=e["stroke-width"]%2/2,h=C(h)+i,f=C(f)+i,g=C(g)+i,t+=i,x+=i,E=["M",t,g,"L",t,f,"L",x,f,"L",x,g,"L",t,g,"z"]),D&&(i=w["stroke-width"]%2/2,j+=i,l+=i,p=["M",h-v*D,j,"L",h+v*D,j,"M",h-v*D,l,"L",h+v*D,l]),i=u["stroke-width"]%2/2,o=I(b.medianPlot)+i,m=["M",t,o,"L",x,o,"z"],k)b.stem.animate({d:n}),D&&b.whiskers.animate({d:p}),z&&b.box.animate({d:E}),b.medianShape.animate({d:m});
else{b.graphic=k=d.g().add(a.group);b.stem=d.path(n).attr(s).add(k);if(D)b.whiskers=d.path(p).attr(w).add(k);if(z)b.box=d.path(E).attr(e).add(k);b.medianShape=d.path(m).attr(u).add(k)}})}});n.errorbar=m(n.boxplot,{color:"#000000",grouping:!1,linkedTo:":previous",tooltip:{pointFormat:n.arearange.tooltip.pointFormat},whiskerWidth:null});h.errorbar=A(h.boxplot,{type:"errorbar",pointArrayMap:["low","high"],toYData:function(a){return[a.low,a.high]},pointValKey:"high",doQuartiles:!1,getColumnMetrics:function(){return this.linkedParent&&
this.linkedParent.columnMetrics||h.column.prototype.getColumnMetrics.call(this)}});p(G,"getSeriesExtremes",function(a,b){a.call(this,b);if(!this.isXAxis){var c=this,d=[],e=!0;r(c.series,function(a){if(a.visible&&a.stackKey&&!(a.type!=="waterfall"||HighchartsAdapter.inArray(a.stackKey)!==-1)){if(e)c.dataMin=c.dataMax=null,e=!1;var b=a.processedYData,j=b.length,l=b[0],h=b[0],i=a.options.threshold,k=c.stacks,n=a.stackKey,p="-"+n,s,E,m,w;for(w=0;w<j;w++){m=b[w]<i?p:n;s=k[m][w].total;if(w>i)s+=E,k[m][w].setTotal(s),
k[m][w]._cum=null;s<l&&(l=s);s>h&&(h=s);E=s}a.dataMin=l;a.dataMax=h;c.dataMin=T(q(c.dataMin,l),l,i);c.dataMax=U(q(c.dataMax,h),h,i);d.push(a.stackKey);if(typeof i==="number")if(c.dataMin>=i)c.dataMin=i,c.ignoreMinPadding=!0;else if(c.dataMax<i)c.dataMax=i,c.ignoreMaxPadding=!0}})}});n.waterfall=m(n.column,{lineWidth:1,lineColor:"#333",dashStyle:"dot",borderColor:"#333"});h.waterfall=A(h.column,{type:"waterfall",upColorProp:"fill",pointArrayMap:["y","low"],pointValKey:"y",init:function(a,b){b.stacking=
!0;h.column.prototype.init.call(this,a,b)},translate:function(){var a=this.yAxis,b,c,d,e,f,g,j,l,o,i,k,n,m,p=this.options.borderWidth%2/2;h.column.prototype.translate.apply(this);d=this.points;o=j=d[0];g=l=d[0].y;for(c=1,b=d.length;c<b;c++)if(e=d[c],f=e.shapeArgs,m=this.getStack(c),k=this.getStack(c-1),n=this.getStackY(k),o===null&&(o=e,l=0),e.y&&!e.isSum&&!e.isIntermediateSum&&(g+=e.y,l+=e.y),e.isSum||e.isIntermediateSum)e.isIntermediateSum?(i=this.getSumEdges(o,d[c-1]),e.y=l,o=null):(i=this.getSumEdges(j,
d[c-1]),e.y=g),f.y=e.plotY=i[1],f.height=i[0]-i[1];else if(i=m._cum===null?k.total:m._cum,m._cum=i+e.y,e.y<0)f.y=J(a.translate(i,0,1))-p,f.height=J(a.translate(m._cum,0,1)-f.y);else{if(k.total+e.y<0)f.y=a.translate(m._cum,0,1);f.height=C(n-f.y)}},processData:function(a){B.prototype.processData.call(this,a);var a=this.yData,b=a.length,c,d;for(d=0;d<b;d++)c=a[d],c!==null&&typeof c!=="number"&&(a[d]=c==="sum"?null:c==="intermediateSum"?null:c[0])},toYData:function(a){if(a.isSum)return"sum";else if(a.isIntermediateSum)return"intermediateSum";
return[a.y]},getAttribs:function(){h.column.prototype.getAttribs.apply(this,arguments);var a=this.options,b=a.states,c=a.upColor||this.color,a=k.Color(c).brighten(0.1).get(),d=m(this.pointAttr),e=this.upColorProp;d[""][e]=c;d.hover[e]=b.hover.upColor||a;d.select[e]=b.select.upColor||c;r(this.points,function(a){if(a.y>0&&!a.color)a.pointAttr=d,a.color=c})},getGraphPath:function(){var a=this.data,b=a.length,c=I(this.options.lineWidth+this.options.borderWidth)%2/2,d=[],e,f,g;for(g=1;g<b;g++)f=a[g].shapeArgs,
e=a[g-1].shapeArgs,f=["M",e.x+e.width,e.y+c,"L",f.x,e.y+c],a[g-1].y<0&&(f[2]+=e.height,f[5]+=e.height),d=d.concat(f);return d},getStack:function(a){var b=this.yAxis.stacks,c=this.stackKey;this.processedYData[a]<this.options.threshold&&(c="-"+c);return b[c][a]},getStackY:function(a){return J(this.yAxis.translate(a.total,null,!0))},getSumEdges:function(a,b){var c,d,e;d=this.options.threshold;c=a.y>=d?a.shapeArgs.y+a.shapeArgs.height:a.shapeArgs.y;d=b.y>=d?b.shapeArgs.y:b.shapeArgs.y+b.shapeArgs.height;
d>c&&(e=c,c=d,d=e);return[c,d]},drawGraph:B.prototype.drawGraph});n.bubble=m(n.scatter,{dataLabels:{inside:!0,style:{color:"white",textShadow:"0px 0px 3px black"},verticalAlign:"middle"},marker:{lineColor:null,lineWidth:1},minSize:8,maxSize:"20%",tooltip:{pointFormat:"({point.x}, {point.y}), Size: {point.z}"},zThreshold:0});h.bubble=A(h.scatter,{type:"bubble",pointArrayMap:["y","z"],trackerGroups:["group","dataLabelsGroup"],pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor"},
applyOpacity:function(a){var b=this.options.marker,c=q(b.fillOpacity,0.5),a=a||b.fillColor||this.color;c!==1&&(a=k.Color(a).setOpacity(c).get("rgba"));return a},convertAttribs:function(){var a=B.prototype.convertAttribs.apply(this,arguments);a.fill=this.applyOpacity(a.fill);return a},getRadii:function(a,b,c,d){var e,f,g,j=this.zData,h=[];for(f=0,e=j.length;f<e;f++)g=b-a,g=g>0?(j[f]-a)/(b-a):0.5,h.push(u.ceil(c+g*(d-c))/2);this.radii=h},animate:function(a){var b=this.options.animation;if(!a)r(this.points,
function(a){var d=a.graphic,a=a.shapeArgs;d&&a&&(d.attr("r",1),d.animate({r:a.r},b))}),this.animate=null},translate:function(){var a,b=this.data,c,d,e=this.radii;h.scatter.prototype.translate.call(this);for(a=b.length;a--;)c=b[a],d=e?e[a]:0,c.negative=c.z<(this.options.zThreshold||0),d>=this.minPxSize/2?(c.shapeType="circle",c.shapeArgs={x:c.plotX,y:c.plotY,r:d},c.dlBox={x:c.plotX-d,y:c.plotY-d,width:2*d,height:2*d}):c.shapeArgs=c.plotY=c.dlBox=F},drawLegendSymbol:function(a,b){var c=x(a.itemStyle.fontSize)/
2;b.legendSymbol=this.chart.renderer.circle(c,a.baseline-c,c).attr({zIndex:3}).add(b.legendGroup)},drawPoints:h.column.prototype.drawPoints,alignDataLabel:h.column.prototype.alignDataLabel});O.prototype.beforePadding=function(){var a=this,b=this.len,c=this.chart,d=0,e=b,f=this.isXAxis,g=f?"xData":"yData",j=this.min,h={},k=u.min(c.plotWidth,c.plotHeight),i=Number.MAX_VALUE,m=-Number.MAX_VALUE,n=this.max-j,p=b/n,s=[];this.tickPositions&&(r(this.series,function(b){var c=b.options;if(b.type==="bubble"&&
b.visible&&(a.allowZoomOutside=!0,s.push(b),f))r(["minSize","maxSize"],function(a){var b=c[a],d=/%$/.test(b),b=x(b);h[a]=d?k*b/100:b}),b.minPxSize=h.minSize,b=b.zData,b.length&&(i=u.min(i,u.max(Q(b),c.displayNegative===!1?c.zThreshold:-Number.MAX_VALUE)),m=u.max(m,R(b)))}),r(s,function(a){var b=a[g],c=b.length,k;f&&a.getRadii(i,m,h.minSize,h.maxSize);if(n>0)for(;c--;)k=a.radii[c],d=Math.min((b[c]-j)*p-k,d),e=Math.max((b[c]-j)*p+k,e)}),n>0&&q(this.options.min,this.userMin)===F&&q(this.options.max,
this.userMax)===F&&(e-=b,p*=(b+d-e)/b,this.min+=d/p,this.max+=e/p))};var z=B.prototype,n=k.Pointer.prototype;z.toXY=function(a){var b,c=this.chart;b=a.plotX;var d=a.plotY;a.rectPlotX=b;a.rectPlotY=d;a.clientX=b/Math.PI*180;b=this.xAxis.postTranslate(a.plotX,this.yAxis.len-d);a.plotX=a.polarPlotX=b.x-c.plotLeft;a.plotY=a.polarPlotY=b.y-c.plotTop};p(h.area.prototype,"init",L);p(h.areaspline.prototype,"init",L);p(h.spline.prototype,"getPointSpline",function(a,b,c,d){var e,f,g,j,h,k,i;if(this.chart.polar){e=
c.plotX;f=c.plotY;a=b[d-1];g=b[d+1];this.connectEnds&&(a||(a=b[b.length-2]),g||(g=b[1]));if(a&&g)j=a.plotX,h=a.plotY,b=g.plotX,k=g.plotY,j=(1.5*e+j)/2.5,h=(1.5*f+h)/2.5,g=(1.5*e+b)/2.5,i=(1.5*f+k)/2.5,b=Math.sqrt(Math.pow(j-e,2)+Math.pow(h-f,2)),k=Math.sqrt(Math.pow(g-e,2)+Math.pow(i-f,2)),j=Math.atan2(h-f,j-e),h=Math.atan2(i-f,g-e),i=Math.PI/2+(j+h)/2,Math.abs(j-i)>Math.PI/2&&(i-=Math.PI),j=e+Math.cos(i)*b,h=f+Math.sin(i)*b,g=e+Math.cos(Math.PI+i)*k,i=f+Math.sin(Math.PI+i)*k,c.rightContX=g,c.rightContY=
i;d?(c=["C",a.rightContX||a.plotX,a.rightContY||a.plotY,j||e,h||f,e,f],a.rightContX=a.rightContY=null):c=["M",e,f]}else c=a.call(this,b,c,d);return c});p(z,"translate",function(a){a.call(this);if(this.chart.polar&&!this.preventPostTranslate)for(var a=this.points,b=a.length;b--;)this.toXY(a[b])});p(z,"getSegmentPath",function(a,b){var c=this.points;if(this.chart.polar&&this.options.connectEnds!==!1&&b[b.length-1]===c[c.length-1]&&c[0].y!==null)this.connectEnds=!0,b=[].concat(b,[c[0]]);return a.call(this,
b)});p(z,"animate",M);p(y,"animate",M);p(z,"setTooltipPoints",function(a,b){this.chart.polar&&H(this.xAxis,{tooltipLen:360});return a.call(this,b)});p(y,"translate",function(a){var b=this.xAxis,c=this.yAxis.len,d=b.center,e=b.startAngleRad,f=this.chart.renderer,g,h;this.preventPostTranslate=!0;a.call(this);if(b.isRadial){b=this.points;for(h=b.length;h--;)g=b[h],a=g.barX+e,g.shapeType="path",g.shapeArgs={d:f.symbols.arc(d[0],d[1],c-g.plotY,null,{start:a,end:a+g.pointWidth,innerR:c-q(g.yBottom,c)})},
this.toXY(g)}});p(y,"alignDataLabel",function(a,b,c,d,e,f){if(this.chart.polar){a=b.rectPlotX/Math.PI*180;if(d.align===null)d.align=a>20&&a<160?"left":a>200&&a<340?"right":"center";if(d.verticalAlign===null)d.verticalAlign=a<45||a>315?"bottom":a>135&&a<225?"top":"middle";z.alignDataLabel.call(this,b,c,d,e,f)}else a.call(this,b,c,d,e,f)});p(n,"getIndex",function(a,b){var c,d=this.chart,e;d.polar?(e=d.xAxis[0].center,c=b.chartX-e[0]-d.plotLeft,d=b.chartY-e[1]-d.plotTop,c=180-Math.round(Math.atan2(c,
d)/Math.PI*180)):c=a.call(this,b);return c});p(n,"getCoordinates",function(a,b){var c=this.chart,d={xAxis:[],yAxis:[]};c.polar?r(c.axes,function(a){var f=a.isXAxis,g=a.center,h=b.chartX-g[0]-c.plotLeft,g=b.chartY-g[1]-c.plotTop;d[f?"xAxis":"yAxis"].push({axis:a,value:a.translate(f?Math.PI-Math.atan2(h,g):Math.sqrt(Math.pow(h,2)+Math.pow(g,2)),!0)})}):d=a.call(this,b);return d})})(Highcharts);
/*
 Highstock JS v1.3.2 (2013-06-05)

 (c) 2009-2013 Torstein Hønsi

 License: www.highcharts.com/license
*/

(function(){function y(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a}function z(){var a,b=arguments.length,c={},d=function(a,b){var c,h;for(h in b)b.hasOwnProperty(h)&&(c=b[h],typeof a!=="object"&&(a={}),a[h]=c&&typeof c==="object"&&Object.prototype.toString.call(c)!=="[object Array]"&&typeof c.nodeType!=="number"?d(a[h]||{},c):b[h]);return a};for(a=0;a<b;a++)c=d(c,arguments[a]);return c}function jb(){for(var a=0,b=arguments,c=b.length,d={};a<c;a++)d[b[a++]]=b[a];return d}function C(a,b){return parseInt(a,
b||10)}function ma(a){return typeof a==="string"}function da(a){return typeof a==="object"}function Wa(a){return Object.prototype.toString.call(a)==="[object Array]"}function Ja(a){return typeof a==="number"}function ra(a){return P.log(a)/P.LN10}function la(a){return P.pow(10,a)}function na(a,b){for(var c=a.length;c--;)if(a[c]===b){a.splice(c,1);break}}function v(a){return a!==w&&a!==null}function G(a,b,c){var d,e;if(ma(b))v(c)?a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(v(b)&&
da(b))for(d in b)a.setAttribute(d,b[d]);return e}function ja(a){return Wa(a)?a:[a]}function p(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],typeof c!=="undefined"&&c!==null)return c}function L(a,b){if(Xa&&b&&b.opacity!==w)b.filter="alpha(opacity="+b.opacity*100+")";y(a.style,b)}function aa(a,b,c,d,e){a=H.createElement(a);b&&y(a,b);e&&L(a,{padding:0,border:ba,margin:0});c&&L(a,c);d&&d.appendChild(a);return a}function ea(a,b){var c=function(){};c.prototype=new a;y(c.prototype,b);return c}
function xa(a,b,c,d){var e=M.lang,f=b===-1?((a||0).toString().split(".")[1]||"").length:isNaN(b=U(b))?2:b,b=c===void 0?e.decimalPoint:c,d=d===void 0?e.thousandsSep:d,e=a<0?"-":"",c=String(C(a=U(+a||0).toFixed(f))),g=c.length>3?c.length%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+U(a-c).toFixed(f).slice(2):"")}function Ka(a,b){return Array((b||2)+1-String(a).length).join(0)+a}function sa(a,b,c){var d=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments);
a.unshift(d);return c.apply(this,a)}}function La(a,b){for(var c="{",d=!1,e,f,g,h,i,j=[];(c=a.indexOf(c))!==-1;){e=a.slice(0,c);if(d){f=e.split(":");g=f.shift().split(".");i=g.length;e=b;for(h=0;h<i;h++)e=e[g[h]];if(f.length)f=f.join(":"),g=/\.([0-9])/,h=M.lang,i=void 0,/f$/.test(f)?(i=(i=f.match(g))?i[1]:-1,e=xa(e,i,h.decimalPoint,f.indexOf(",")>-1?h.thousandsSep:"")):e=ya(f,e)}j.push(e);a=a.slice(c+1);c=(d=!d)?"}":"{"}j.push(a);return j.join("")}function yb(a,b,c,d){var e,c=p(c,1);e=a/c;b||(b=[1,
2,2.5,5,10],d&&d.allowDecimals===!1&&(c===1?b=[1,2,5,10]:c<=0.1&&(b=[1/c])));for(d=0;d<b.length;d++)if(a=b[d],e<=(b[d]+(b[d+1]||b[d]))/2)break;a*=c;return a}function zb(a,b){var c=b||[[kb,[1,2,5,10,20,25,50,100,200,500]],[eb,[1,2,5,10,15,30]],[Ya,[1,2,5,10,15,30]],[za,[1,2,3,4,6,8,12]],[ga,[1,2]],[Ma,[1,2]],[Na,[1,2,3,4,6]],[ta,null]],d=c[c.length-1],e=I[d[0]],f=d[1],g;for(g=0;g<c.length;g++)if(d=c[g],e=I[d[0]],f=d[1],c[g+1]&&a<=(e*f[f.length-1]+I[c[g+1][0]])/2)break;e===I[ta]&&a<5*e&&(f=[1,2,5]);
e===I[ta]&&a<5*e&&(f=[1,2,5]);c=yb(a/e,f);return{unitRange:e,count:c,unitName:d[0]}}function fb(a,b,c,d){var e=[],f={},g=M.global.useUTC,h,i=new Date(b),j=a.unitRange,k=a.count;if(v(b)){j>=I[eb]&&(i.setMilliseconds(0),i.setSeconds(j>=I[Ya]?0:k*W(i.getSeconds()/k)));if(j>=I[Ya])i[Nb](j>=I[za]?0:k*W(i[Ab]()/k));if(j>=I[za])i[Ob](j>=I[ga]?0:k*W(i[Bb]()/k));if(j>=I[ga])i[Cb](j>=I[Na]?1:k*W(i[Oa]()/k));j>=I[Na]&&(i[Pb](j>=I[ta]?0:k*W(i[lb]()/k)),h=i[mb]());j>=I[ta]&&(h-=h%k,i[Qb](h));if(j===I[Ma])i[Cb](i[Oa]()-
i[Db]()+p(d,1));b=1;h=i[mb]();for(var d=i.getTime(),m=i[lb](),l=i[Oa](),o=g?0:(864E5+i.getTimezoneOffset()*6E4)%864E5;d<c;)e.push(d),j===I[ta]?d=nb(h+b*k,0):j===I[Na]?d=nb(h,m+b*k):!g&&(j===I[ga]||j===I[Ma])?d=nb(h,m,l+b*k*(j===I[ga]?1:7)):d+=j*k,b++;e.push(d);n(Eb(e,function(a){return j<=I[za]&&a%I[ga]===o}),function(a){f[a]=ga})}e.info=y(a,{higherRanks:f,totalRange:j*k});return e}function Rb(){this.symbol=this.color=0}function Sb(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].ss_i=e;a.sort(function(a,
c){d=b(a,c);return d===0?a.ss_i-c.ss_i:d});for(e=0;e<c;e++)delete a[e].ss_i}function Pa(a){for(var b=a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function ua(a){for(var b=a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function Aa(a,b){for(var c in a)a[c]&&a[c]!==b&&a[c].destroy&&a[c].destroy(),delete a[c]}function Za(a){ob||(ob=aa(Qa));a&&ob.appendChild(a);ob.innerHTML=""}function Ba(a,b){var c="Highcharts error #"+a+": www.highcharts.com/errors/"+a;if(b)throw c;else Y.console&&console.log(c)}function oa(a){return parseFloat(a.toPrecision(14))}
function $a(a,b){Ra=p(a,b.animation)}function Tb(){var a=M.global.useUTC,b=a?"getUTC":"get",c=a?"setUTC":"set";nb=a?Date.UTC:function(a,b,c,g,h,i){return(new Date(a,b,p(c,1),p(g,0),p(h,0),p(i,0))).getTime()};Ab=b+"Minutes";Bb=b+"Hours";Db=b+"Day";Oa=b+"Date";lb=b+"Month";mb=b+"FullYear";Nb=c+"Minutes";Ob=c+"Hours";Cb=c+"Date";Pb=c+"Month";Qb=c+"FullYear"}function Ca(){}function ab(a,b,c,d){this.axis=a;this.pos=b;this.type=c||"";this.isNew=!0;!c&&!d&&this.addLabel()}function Fb(a,b){this.axis=a;if(b)this.options=
b,this.id=b.id}function Ub(a,b,c,d,e,f){var g=a.chart.inverted;this.axis=a;this.isNegative=c;this.options=b;this.x=d;this.stack=e;this.percent=f==="percent";this.alignOptions={align:b.align||(g?c?"left":"right":"center"),verticalAlign:b.verticalAlign||(g?"middle":c?"bottom":"top"),y:p(b.y,g?4:c?14:-6),x:p(b.x,g?c?-6:6:0)};this.textAlign=b.textAlign||(g?c?"right":"left":"center")}function Da(){this.init.apply(this,arguments)}function Gb(){this.init.apply(this,arguments)}function pb(a,b){this.init(a,
b)}function Hb(a,b){this.init(a,b)}function Sa(){this.init.apply(this,arguments)}function Ib(a){var b=a.options,c=b.navigator,d=c.enabled,b=b.scrollbar,e=b.enabled,f=d?c.height:0,g=e?b.height:0,h=c.baseSeries;this.baseSeries=a.series[h]||typeof h==="string"&&a.get(h)||a.series[0];this.handles=[];this.scrollbarButtons=[];this.elementsToDestroy=[];this.chart=a;this.height=f;this.scrollbarHeight=g;this.scrollbarEnabled=e;this.navigatorEnabled=d;this.navigatorOptions=c;this.scrollbarOptions=b;this.outlineHeight=
f+g;this.init()}function Jb(a){this.init(a)}var w,H=document,Y=window,P=Math,r=P.round,W=P.floor,pa=P.ceil,t=P.max,A=P.min,U=P.abs,ha=P.cos,ka=P.sin,bb=P.PI,qb=bb*2/360,Ta=navigator.userAgent,Vb=Y.opera,Xa=/msie/i.test(Ta)&&!Vb,rb=H.documentMode===8,sb=/AppleWebKit/.test(Ta),tb=/Firefox/.test(Ta),ub=/(Mobile|Android|Windows Phone)/.test(Ta),Ea="http://www.w3.org/2000/svg",ca=!!H.createElementNS&&!!H.createElementNS(Ea,"svg").createSVGRect,cc=tb&&parseInt(Ta.split("Firefox/")[1],10)<4,ia=!ca&&!Xa&&
!!H.createElement("canvas").getContext,cb,gb=H.documentElement.ontouchstart!==w,Wb={},Kb=0,ob,M,ya,Ra,Lb,I,qa=function(){},Ua=[],Qa="div",ba="none",Xb="rgba(192,192,192,"+(ca?1.0E-4:0.002)+")",kb="millisecond",eb="second",Ya="minute",za="hour",ga="day",Ma="week",Na="month",ta="year",Yb="stroke-width",nb,Ab,Bb,Db,Oa,lb,mb,Nb,Ob,Cb,Pb,Qb,Q={};Y.Highcharts=Y.Highcharts?Ba(16,!0):{};ya=function(a,b,c){if(!v(b)||isNaN(b))return"Invalid date";var a=p(a,"%Y-%m-%d %H:%M:%S"),d=new Date(b),e,f=d[Bb](),g=d[Db](),
h=d[Oa](),i=d[lb](),j=d[mb](),k=M.lang,m=k.weekdays,d=y({a:m[g].substr(0,3),A:m[g],d:Ka(h),e:h,b:k.shortMonths[i],B:k.months[i],m:Ka(i+1),y:j.toString().substr(2,2),Y:j,H:Ka(f),I:Ka(f%12||12),l:f%12||12,M:Ka(d[Ab]()),p:f<12?"AM":"PM",P:f<12?"am":"pm",S:Ka(d.getSeconds()),L:Ka(r(b%1E3),3)},Highcharts.dateFormats);for(e in d)for(;a.indexOf("%"+e)!==-1;)a=a.replace("%"+e,typeof d[e]==="function"?d[e](b):d[e]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};Rb.prototype={wrapColor:function(a){if(this.color>=
a)this.color=0},wrapSymbol:function(a){if(this.symbol>=a)this.symbol=0}};I=jb(kb,1,eb,1E3,Ya,6E4,za,36E5,ga,864E5,Ma,6048E5,Na,26784E5,ta,31556952E3);Lb={init:function(a,b,c){var b=b||"",d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g,b=b.split(" "),c=[].concat(c),h,i,j=function(a){for(g=a.length;g--;)a[g]==="M"&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};e&&(j(b),j(c));a.isArea&&(h=b.splice(b.length-6,6),i=c.splice(c.length-6,6));if(d<=c.length/f)for(;d--;)c=[].concat(c).splice(0,f).concat(c);a.shift=
0;if(b.length)for(a=c.length;b.length<a;)d=[].concat(b).splice(b.length-f,f),e&&(d[f-6]=d[f-2],d[f-5]=d[f-1]),b=b.concat(d);h&&(b=b.concat(h),c=c.concat(i));return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(c===1)e=d;else if(f===b.length&&c<1)for(;f--;)d=parseFloat(a[f]),e[f]=isNaN(d)?a[f]:c*parseFloat(b[f]-d)+d;else e=b;return e}};(function(a){Y.HighchartsAdapter=Y.HighchartsAdapter||a&&{init:function(b){var c=a.fx,d=c.step,e,f=a.Tween,g=f&&f.propHooks;e=a.cssHooks.opacity;a.extend(a.easing,
{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});a.each(["cur","_default","width","height","opacity"],function(a,b){var e=d,k,m;b==="cur"?e=c.prototype:b==="_default"&&f&&(e=g[b],b="set");(k=e[b])&&(e[b]=function(c){c=a?c:this;m=c.elem;return m.attr?m.attr(c.prop,b==="cur"?w:c.now):k.apply(this,arguments)})});sa(e,"get",function(a,b,c){return b.attr?b.opacity||0:a.call(this,b,c)});e=function(a){var c=a.elem,d;if(!a.started)d=b.init(c,c.d,c.toD),a.start=d[0],a.end=d[1],a.started=!0;c.attr("d",
b.step(a.start,a.end,a.pos,c.toD))};f?g.d={set:e}:d.d=e;this.each=Array.prototype.forEach?function(a,b){return Array.prototype.forEach.call(a,b)}:function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===!1)return c};a.fn.highcharts=function(){var a="Chart",b=arguments,c,d;ma(b[0])&&(a=b[0],b=Array.prototype.slice.call(b,1));c=b[0];if(c!==w)c.chart=c.chart||{},c.chart.renderTo=this[0],new Highcharts[a](c,b[1]),d=this;c===w&&(d=Ua[G(this[0],"data-highcharts-chart")]);return d}},getScript:a.getScript,
inArray:a.inArray,adapterRun:function(b,c){return a(b)[c]()},grep:a.grep,map:function(a,c){for(var d=[],e=0,f=a.length;e<f;e++)d[e]=c.call(a[e],a[e],e,a);return d},offset:function(b){return a(b).offset()},addEvent:function(b,c,d){a(b).bind(c,d)},removeEvent:function(b,c,d){var e=H.removeEventListener?"removeEventListener":"detachEvent";H[e]&&b&&!b[e]&&(b[e]=function(){});a(b).unbind(c,d)},fireEvent:function(b,c,d,e){var f=a.Event(c),g="detached"+c,h;!Xa&&d&&(delete d.layerX,delete d.layerY);y(f,d);
b[c]&&(b[g]=b[c],b[c]=null);a.each(["preventDefault","stopPropagation"],function(a,b){var c=f[b];f[b]=function(){try{c.call(f)}catch(a){b==="preventDefault"&&(h=!0)}}});a(b).trigger(f);b[g]&&(b[c]=b[g],b[g]=null);e&&!f.isDefaultPrevented()&&!h&&e(f)},washMouseEvent:function(a){var c=a.originalEvent||a;if(c.pageX===w)c.pageX=a.pageX,c.pageY=a.pageY;return c},animate:function(b,c,d){var e=a(b);if(!b.style)b.style={};if(c.d)b.toD=c.d,c.d=1;e.stop();e.animate(c,d)},stop:function(b){a(b).stop()}}})(Y.jQuery);
var R=Y.HighchartsAdapter,D=R||{};R&&R.init.call(R,Lb);var vb=D.adapterRun,dc=D.getScript,va=D.inArray,n=D.each,Eb=D.grep,ec=D.offset,Fa=D.map,F=D.addEvent,X=D.removeEvent,K=D.fireEvent,Zb=D.washMouseEvent,Mb=D.animate,hb=D.stop,D={enabled:!0,align:"center",x:0,y:15,style:{color:"#666",cursor:"default",fontSize:"11px",lineHeight:"14px"}};M={colors:"#2f7ed8,#0d233a,#8bbc21,#910000,#1aadce,#492970,#f28f43,#77a1e5,#c42525,#a6c96a".split(","),symbols:["circle","diamond","square","triangle","triangle-down"],
lang:{loading:"Loading...",months:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),decimalPoint:".",numericSymbols:"k,M,G,T,P,E".split(","),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:","},global:{useUTC:!0,canvasToolsURL:"http://code.highcharts.com/stock/1.3.2/modules/canvas-tools.js",
VMLRadialGradientURL:"http://code.highcharts.com/stock/1.3.2/gfx/vml-radial-gradient.png"},chart:{borderColor:"#4572A7",borderRadius:5,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacingTop:10,spacingRight:10,spacingBottom:15,spacingLeft:10,style:{fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',fontSize:"12px"},backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10}}},title:{text:"Chart title",
align:"center",y:15,style:{color:"#274b6d",fontSize:"16px"}},subtitle:{text:"",align:"center",y:30,style:{color:"#4d759e"}},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,marker:{enabled:!0,lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{enabled:!0},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:z(D,{enabled:!1,formatter:function(){return xa(this.y,-1)},verticalAlign:"bottom",y:0}),cropThreshold:300,
pointRange:0,showInLegend:!0,states:{hover:{marker:{}},select:{marker:{}}},stickyTracking:!0}},labels:{style:{position:"absolute",color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderWidth:1,borderColor:"#909090",borderRadius:5,navigation:{activeColor:"#274b6d",inactiveColor:"#CCC"},shadow:!1,itemStyle:{cursor:"pointer",color:"#274b6d",fontSize:"12px"},itemHoverStyle:{color:"#000"},itemHiddenStyle:{color:"#CCC"},itemCheckboxStyle:{position:"absolute",
width:"13px",height:"13px"},symbolWidth:16,symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"1em"},style:{position:"absolute",backgroundColor:"white",opacity:0.5,textAlign:"center"}},tooltip:{enabled:!0,animation:ca,backgroundColor:"rgba(255, 255, 255, .85)",borderWidth:1,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",
day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',shadow:!0,snap:ub?25:10,style:{color:"#333333",cursor:"default",fontSize:"12px",padding:"8px",whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",
color:"#909090",fontSize:"9px"}}};var S=M.plotOptions,R=S.line;Tb();var wa=function(a){var b=[],c,d;(function(a){a&&a.stops?d=Fa(a.stops,function(a){return wa(a[1])}):(c=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(a))?b=[C(c[1]),C(c[2]),C(c[3]),parseFloat(c[4],10)]:(c=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(a))?b=[C(c[1],16),C(c[2],16),C(c[3],16),1]:(c=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(a))&&
(b=[C(c[1]),C(c[2]),C(c[3]),1])})(a);return{get:function(c){var f;d?(f=z(a),f.stops=[].concat(f.stops),n(d,function(a,b){f.stops[b]=[f.stops[b][0],a.get(c)]})):f=b&&!isNaN(b[0])?c==="rgb"?"rgb("+b[0]+","+b[1]+","+b[2]+")":c==="a"?b[3]:"rgba("+b.join(",")+")":a;return f},brighten:function(a){if(d)n(d,function(b){b.brighten(a)});else if(Ja(a)&&a!==0){var c;for(c=0;c<3;c++)b[c]+=C(a*255),b[c]<0&&(b[c]=0),b[c]>255&&(b[c]=255)}return this},rgba:b,setOpacity:function(a){b[3]=a;return this}}};Ca.prototype=
{init:function(a,b){this.element=b==="span"?aa(b):H.createElementNS(Ea,b);this.renderer=a;this.attrSetters={}},opacity:1,animate:function(a,b,c){b=p(b,Ra,!0);hb(this);if(b){b=z(b);if(c)b.complete=c;Mb(this,a,b)}else this.attr(a),c&&c()},attr:function(a,b){var c,d,e,f,g=this.element,h=g.nodeName.toLowerCase(),i=this.renderer,j,k=this.attrSetters,m=this.shadows,l,o,q=this;ma(a)&&v(b)&&(c=a,a={},a[c]=b);if(ma(a))c=a,h==="circle"?c={x:"cx",y:"cy"}[c]||c:c==="strokeWidth"&&(c="stroke-width"),q=G(g,c)||
this[c]||0,c!=="d"&&c!=="visibility"&&(q=parseFloat(q));else{for(c in a)if(j=!1,d=a[c],e=k[c]&&k[c].call(this,d,c),e!==!1){e!==w&&(d=e);if(c==="d")d&&d.join&&(d=d.join(" ")),/(NaN| {2}|^$)/.test(d)&&(d="M 0 0");else if(c==="x"&&h==="text")for(e=0;e<g.childNodes.length;e++)f=g.childNodes[e],G(f,"x")===G(g,"x")&&G(f,"x",d);else if(this.rotation&&(c==="x"||c==="y"))o=!0;else if(c==="fill")d=i.color(d,g,c);else if(h==="circle"&&(c==="x"||c==="y"))c={x:"cx",y:"cy"}[c]||c;else if(h==="rect"&&c==="r")G(g,
{rx:d,ry:d}),j=!0;else if(c==="translateX"||c==="translateY"||c==="rotation"||c==="verticalAlign"||c==="scaleX"||c==="scaleY")j=o=!0;else if(c==="stroke")d=i.color(d,g,c);else if(c==="dashstyle")if(c="stroke-dasharray",d=d&&d.toLowerCase(),d==="solid")d=ba;else{if(d){d=d.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");
for(e=d.length;e--;)d[e]=C(d[e])*a["stroke-width"];d=d.join(",")}}else if(c==="width")d=C(d);else if(c==="align")c="text-anchor",d={left:"start",center:"middle",right:"end"}[d];else if(c==="title")e=g.getElementsByTagName("title")[0],e||(e=H.createElementNS(Ea,"title"),g.appendChild(e)),e.textContent=d;c==="strokeWidth"&&(c="stroke-width");if(c==="stroke-width"||c==="stroke"){this[c]=d;if(this.stroke&&this["stroke-width"])G(g,"stroke",this.stroke),G(g,"stroke-width",this["stroke-width"]),this.hasStroke=
!0;else if(c==="stroke-width"&&d===0&&this.hasStroke)g.removeAttribute("stroke"),this.hasStroke=!1;j=!0}this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c)&&(l||(this.symbolAttr(a),l=!0),j=!0);if(m&&/^(width|height|visibility|x|y|d|transform)$/.test(c))for(e=m.length;e--;)G(m[e],c,c==="height"?t(d-(m[e].cutHeight||0),0):d);if((c==="width"||c==="height")&&h==="rect"&&d<0)d=0;this[c]=d;c==="text"?(d!==this.textStr&&delete this.bBox,this.textStr=d,this.added&&i.buildText(this)):
j||G(g,c,d)}o&&this.updateTransform()}return q},addClass:function(a){G(this.element,"class",G(this.element,"class")+" "+a);return this},symbolAttr:function(a){var b=this;n("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","),function(c){b[c]=p(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":ba)},crisp:function(a,b,c,d,e){var f,g={},h={},i,a=a||this.strokeWidth||
this.attr&&this.attr("stroke-width")||0;i=r(a)%2/2;h.x=W(b||this.x||0)+i;h.y=W(c||this.y||0)+i;h.width=W((d||this.width||0)-2*i);h.height=W((e||this.height||0)-2*i);h.strokeWidth=a;for(f in h)this[f]!==h[f]&&(this[f]=g[f]=h[f]);return g},css:function(a){var b=this.element,c=a&&a.width&&b.nodeName.toLowerCase()==="text",d,e="",f=function(a,b){return"-"+b.toLowerCase()};if(a&&a.color)a.fill=a.color;this.styles=a=y(this.styles,a);ia&&c&&delete a.width;if(Xa&&!ca)c&&delete a.width,L(this.element,a);else{for(d in a)e+=
d.replace(/([A-Z])/g,f)+":"+a[d]+";";G(b,"style",e)}c&&this.added&&this.renderer.buildText(this);return this},on:function(a,b){if(gb&&a==="click")this.element.ontouchstart=function(a){a.preventDefault();b()};this.element["on"+a]=b;return this},setRadialReference:function(a){this.element.radialReference=a;return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=!0;this.updateTransform();return this},htmlCss:function(a){var b=this.element;if(b=
a&&b.tagName==="SPAN"&&a.width)delete a.width,this.textWidth=b,this.updateTransform();this.styles=y(this.styles,a);L(this.element,a);return this},htmlGetBBox:function(){var a=this.element,b=this.bBox;if(!b){if(a.nodeName==="text")a.style.position="absolute";b=this.bBox={x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}}return b},htmlUpdateTransform:function(){if(this.added){var a=this.renderer,b=this.element,c=this.translateX||0,d=this.translateY||0,e=this.x||0,f=this.y||0,g=
this.textAlign||"left",h={left:0,center:0.5,right:1}[g],i=g&&g!=="left",j=this.shadows;L(b,{marginLeft:c,marginTop:d});j&&n(j,function(a){L(a,{marginLeft:c+1,marginTop:d+1})});this.inverted&&n(b.childNodes,function(c){a.invertChild(c,b)});if(b.tagName==="SPAN"){var k,m,j=this.rotation,l,o=0,q=1,o=0,O;l=C(this.textWidth);var u=this.xCorr||0,s=this.yCorr||0,x=[j,g,b.innerHTML,this.textWidth].join(",");k={};if(x!==this.cTT){if(v(j))a.isSVG?(u=Xa?"-ms-transform":sb?"-webkit-transform":tb?"MozTransform":
Vb?"-o-transform":"",k[u]=k.transform="rotate("+j+"deg)"):(o=j*qb,q=ha(o),o=ka(o),k.filter=j?["progid:DXImageTransform.Microsoft.Matrix(M11=",q,", M12=",-o,", M21=",o,", M22=",q,", sizingMethod='auto expand')"].join(""):ba),L(b,k);k=p(this.elemWidth,b.offsetWidth);m=p(this.elemHeight,b.offsetHeight);if(k>l&&/[ \-]/.test(b.textContent||b.innerText))L(b,{width:l+"px",display:"block",whiteSpace:"normal"}),k=l;l=a.fontMetrics(b.style.fontSize).b;u=q<0&&-k;s=o<0&&-m;O=q*o<0;u+=o*l*(O?1-h:h);s-=q*l*(j?
O?h:1-h:1);i&&(u-=k*h*(q<0?-1:1),j&&(s-=m*h*(o<0?-1:1)),L(b,{textAlign:g}));this.xCorr=u;this.yCorr=s}L(b,{left:e+u+"px",top:f+s+"px"});if(sb)m=b.offsetHeight;this.cTT=x}}else this.alignOnAdd=!0},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.scaleX,d=this.scaleY,e=this.inverted,f=this.rotation;e&&(a+=this.attr("width"),b+=this.attr("height"));a=["translate("+a+","+b+")"];e?a.push("rotate(90) scale(-1,1)"):f&&a.push("rotate("+f+" "+(this.x||0)+" "+(this.y||0)+")");
(v(c)||v(d))&&a.push("scale("+p(c,1)+" "+p(d,1)+")");a.length&&G(this.element,"transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){var d,e,f,g,h={};e=this.renderer;f=e.alignedObjects;if(a){if(this.alignOptions=a,this.alignByTranslate=b,!c||ma(c))this.alignTo=d=c||"renderer",na(f,this),f.push(this),c=null}else a=this.alignOptions,b=this.alignByTranslate,d=this.alignTo;c=p(c,e[d],e);d=a.align;e=a.verticalAlign;f=(c.x||0)+(a.x||
0);g=(c.y||0)+(a.y||0);if(d==="right"||d==="center")f+=(c.width-(a.width||0))/{right:1,center:2}[d];h[b?"translateX":"x"]=r(f);if(e==="bottom"||e==="middle")g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1);h[b?"translateY":"y"]=r(g);this[this.placed?"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(){var a=this.bBox,b=this.renderer,c,d=this.rotation;c=this.element;var e=this.styles,f=d*qb;if(!a){if(c.namespaceURI===Ea||b.forExport){try{a=c.getBBox?y({},c.getBBox()):
{width:c.offsetWidth,height:c.offsetHeight}}catch(g){}if(!a||a.width<0)a={width:0,height:0}}else a=this.htmlGetBBox();if(b.isSVG){b=a.width;c=a.height;if(Xa&&e&&e.fontSize==="11px"&&c.toPrecision(3)==="22.7")a.height=c=14;if(d)a.width=U(c*ka(f))+U(b*ha(f)),a.height=U(c*ha(f))+U(b*ka(f))}this.bBox=a}return a},show:function(){return this.attr({visibility:"visible"})},hide:function(){return this.attr({visibility:"hidden"})},fadeOut:function(a){var b=this;b.animate({opacity:0},{duration:a||150,complete:function(){b.hide()}})},
add:function(a){var b=this.renderer,c=a||b,d=c.element||b.box,e=d.childNodes,f=this.element,g=G(f,"zIndex"),h;if(a)this.parentGroup=a;this.parentInverted=a&&a.inverted;this.textStr!==void 0&&b.buildText(this);if(g)c.handleZ=!0,g=C(g);if(c.handleZ)for(c=0;c<e.length;c++)if(a=e[c],b=G(a,"zIndex"),a!==f&&(C(b)>g||!v(g)&&v(b))){d.insertBefore(f,a);h=!0;break}h||d.appendChild(f);this.added=!0;K(this,"add");return this},safeRemoveChild:function(a){var b=a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=
this,b=a.element||{},c=a.shadows,d,e;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=b.point=null;hb(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();if(a.stops){for(e=0;e<a.stops.length;e++)a.stops[e]=a.stops[e].destroy();a.stops=null}a.safeRemoveChild(b);c&&n(c,function(b){a.safeRemoveChild(b)});a.alignTo&&na(a.renderer.alignedObjects,a);for(d in a)delete a[d];return null},shadow:function(a,b,c){var d=[],e,f,g=this.element,h,i,j,k;if(a){i=p(a.width,3);j=(a.opacity||0.15)/i;k=this.parentInverted?
"(-1,-1)":"("+p(a.offsetX,1)+", "+p(a.offsetY,1)+")";for(e=1;e<=i;e++){f=g.cloneNode(0);h=i*2+1-2*e;G(f,{isShadow:"true",stroke:a.color||"black","stroke-opacity":j*e,"stroke-width":h,transform:"translate"+k,fill:ba});if(c)G(f,"height",t(G(f,"height")-h,0)),f.cutHeight=h;b?b.element.appendChild(f):g.parentNode.insertBefore(f,g);d.push(f)}this.shadows=d}return this}};var Ga=function(){this.init.apply(this,arguments)};Ga.prototype={Element:Ca,init:function(a,b,c,d){var e=location,f;f=this.createElement("svg").attr({xmlns:Ea,
version:"1.1"});a.appendChild(f.element);this.isSVG=!0;this.box=f.element;this.boxWrapper=f;this.alignedObjects=[];this.url=(tb||sb)&&H.getElementsByTagName("base").length?e.href.replace(/#.*?$/,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(H.createTextNode("Created with Highstock 1.3.2"));this.defs=this.createElement("defs").add();this.forExport=d;this.gradients={};this.setSize(b,c,!1);var g;if(tb&&a.getBoundingClientRect)this.subPixelFix=
b=function(){L(a,{left:0,top:0});g=a.getBoundingClientRect();L(a,{left:pa(g.left)-g.left+"px",top:pa(g.top)-g.top+"px"})},b(),F(Y,"resize",b)},isHidden:function(){return!this.boxWrapper.getBBox().width},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();Aa(this.gradients||{});this.gradients=null;if(a)this.defs=a.destroy();this.subPixelFix&&X(Y,"resize",this.subPixelFix);return this.alignedObjects=null},createElement:function(a){var b=new this.Element;b.init(this,
a);return b},draw:function(){},buildText:function(a){for(var b=a.element,c=this,d=c.forExport,e=p(a.textStr,"").toString().replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br.*?>/g),f=b.childNodes,g=/style="([^"]+)"/,h=/href="([^"]+)"/,i=G(b,"x"),j=a.styles,k=j&&j.width&&C(j.width),m=j&&j.lineHeight,l=f.length;l--;)b.removeChild(f[l]);k&&!a.added&&this.box.appendChild(b);
e[e.length-1]===""&&e.pop();n(e,function(e,f){var l,u=0,e=e.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");l=e.split("|||");n(l,function(e){if(e!==""||l.length===1){var o={},n=H.createElementNS(Ea,"tspan"),p;g.test(e)&&(p=e.match(g)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),G(n,"style",p));h.test(e)&&!d&&(G(n,"onclick",'location.href="'+e.match(h)[1]+'"'),L(n,{cursor:"pointer"}));e=(e.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"<").replace(/&gt;/g,">");n.appendChild(H.createTextNode(e));
u?o.dx=0:o.x=i;G(n,o);!u&&f&&(!ca&&d&&L(n,{display:"block"}),G(n,"dy",m||c.fontMetrics(/px$/.test(n.style.fontSize)?n.style.fontSize:j.fontSize).h,sb&&n.offsetHeight));b.appendChild(n);u++;if(k)for(var e=e.replace(/([^\^])-/g,"$1- ").split(" "),E,B=[];e.length||B.length;)delete a.bBox,E=a.getBBox().width,o=E>k,!o||e.length===1?(e=B,B=[],e.length&&(n=H.createElementNS(Ea,"tspan"),G(n,{dy:m||16,x:i}),p&&G(n,"style",p),b.appendChild(n),E>k&&(k=E))):(n.removeChild(n.firstChild),B.unshift(e.pop())),e.length&&
n.appendChild(H.createTextNode(e.join(" ").replace(/- /g,"-")))}})})},button:function(a,b,c,d,e,f,g){var h=this.label(a,b,c,null,null,null,null,null,"button"),i=0,j,k,m,l,o,a={x1:0,y1:0,x2:0,y2:1},e=z({"stroke-width":1,stroke:"#CCCCCC",fill:{linearGradient:a,stops:[[0,"#FEFEFE"],[1,"#F6F6F6"]]},r:2,padding:5,style:{color:"black"}},e);m=e.style;delete e.style;f=z(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#FFF"],[1,"#ACF"]]}},f);l=f.style;delete f.style;g=z(e,{stroke:"#68A",fill:{linearGradient:a,
stops:[[0,"#9BD"],[1,"#CDF"]]}},g);o=g.style;delete g.style;F(h.element,"mouseenter",function(){h.attr(f).css(l)});F(h.element,"mouseleave",function(){j=[e,f,g][i];k=[m,l,o][i];h.attr(j).css(k)});h.setState=function(a){(i=a)?a===2&&h.attr(g).css(o):h.attr(e).css(m)};return h.on("click",function(){d.call(h)}).attr(e).css(y({cursor:"default"},m))},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=r(a[1])-b%2/2);a[2]===a[5]&&(a[2]=a[5]=r(a[2])+b%2/2);return a},path:function(a){var b={fill:ba};Wa(a)?b.d=
a:da(a)&&y(b,a);return this.createElement("path").attr(b)},circle:function(a,b,c){a=da(a)?a:{x:a,y:b,r:c};return this.createElement("circle").attr(a)},arc:function(a,b,c,d,e,f){if(da(a))b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x;return this.symbol("arc",a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0})},rect:function(a,b,c,d,e,f){e=da(a)?a.r:e;e=this.createElement("rect").attr({rx:e,ry:e,fill:ba});return e.attr(da(a)?a:e.crisp(f,a,b,t(c,0),t(d,0)))},setSize:function(a,b,c){var d=this.alignedObjects,
e=d.length;this.width=a;this.height=b;for(this.boxWrapper[p(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=this.createElement("g");return v(a)?b.attr({"class":"highcharts-"+a}):b},image:function(a,b,c,d,e){var f={preserveAspectRatio:ba};arguments.length>1&&y(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",a);return f},
symbol:function(a,b,c,d,e,f){var g,h=this.symbols[a],h=h&&h(r(b),r(c),d,e,f),i=/^url\((.*?)\)$/,j,k;if(h)g=this.path(h),y(g,{symbolName:a,x:b,y:c,width:d,height:e}),f&&y(g,f);else if(i.test(a))k=function(a,b){a.element&&(a.attr({width:b[0],height:b[1]}),a.alignByTranslate||a.translate(r((d-b[0])/2),r((e-b[1])/2)))},j=a.match(i)[1],a=Wb[j],g=this.image(j).attr({x:b,y:c}),g.isImg=!0,a?k(g,a):(g.attr({width:0,height:0}),aa("img",{onload:function(){k(g,Wb[j]=[this.width,this.height])},src:j}));return g},
symbols:{circle:function(a,b,c,d){var e=0.166*c;return["M",a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c,b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d/2,a+c/2,b+d,a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start,c=e.r||c||d,g=e.end-0.001,d=e.innerR,
h=e.open,i=ha(f),j=ka(f),k=ha(g),g=ka(g),e=e.end-f<bb?0:1;return["M",a+c*i,b+c*j,"A",c,c,0,e,1,a+c*k,b+c*g,h?"M":"L",a+d*k,b+d*g,"A",d,d,0,e,0,a+d*i,b+d*j,h?"":"Z"]}},clipRect:function(a,b,c,d){var e="highcharts-"+Kb++,f=this.createElement("clipPath").attr({id:e}).add(this.defs),a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;return a},color:function(a,b,c){var d=this,e,f=/^rgba/,g,h,i,j,k,m,l,o=[];a&&a.linearGradient?g="linearGradient":a&&a.radialGradient&&(g="radialGradient");if(g){c=a[g];h=d.gradients;
j=a.stops;b=b.radialReference;Wa(c)&&(a[g]=c={x1:c[0],y1:c[1],x2:c[2],y2:c[3],gradientUnits:"userSpaceOnUse"});g==="radialGradient"&&b&&!v(c.gradientUnits)&&(c=z(c,{cx:b[0]-b[2]/2+c.cx*b[2],cy:b[1]-b[2]/2+c.cy*b[2],r:c.r*b[2],gradientUnits:"userSpaceOnUse"}));for(l in c)l!=="id"&&o.push(l,c[l]);for(l in j)o.push(j[l]);o=o.join(",");h[o]?a=h[o].id:(c.id=a="highcharts-"+Kb++,h[o]=i=d.createElement(g).attr(c).add(d.defs),i.stops=[],n(j,function(a){f.test(a[1])?(e=wa(a[1]),k=e.get("rgb"),m=e.get("a")):
(k=a[1],m=1);a=d.createElement("stop").attr({offset:a[0],"stop-color":k,"stop-opacity":m}).add(i);i.stops.push(a)}));return"url("+d.url+"#"+a+")"}else return f.test(a)?(e=wa(a),G(b,c+"-opacity",e.get("a")),e.get("rgb")):(b.removeAttribute(c+"-opacity"),a)},text:function(a,b,c,d){var e=M.chart.style,f=ia||!ca&&this.forExport;if(d&&!this.forExport)return this.html(a,b,c);b=r(p(b,0));c=r(p(c,0));a=this.createElement("text").attr({x:b,y:c,text:a}).css({fontFamily:e.fontFamily,fontSize:e.fontSize});f&&
a.css({position:"absolute"});a.x=b;a.y=c;return a},html:function(a,b,c){var d=M.chart.style,e=this.createElement("span"),f=e.attrSetters,g=e.element,h=e.renderer;f.text=function(a){a!==g.innerHTML&&delete this.bBox;g.innerHTML=a;return!1};f.x=f.y=f.align=function(a,b){b==="align"&&(b="textAlign");e[b]=a;e.htmlUpdateTransform();return!1};e.attr({text:a,x:r(b),y:r(c)}).css({position:"absolute",whiteSpace:"nowrap",fontFamily:d.fontFamily,fontSize:d.fontSize});e.css=e.htmlCss;if(h.isSVG)e.add=function(a){var b,
c=h.box.parentNode,d=[];if(a){if(b=a.div,!b){for(;a;)d.push(a),a=a.parentGroup;n(d.reverse(),function(a){var d;b=a.div=a.div||aa(Qa,{className:G(a.element,"class")},{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px"},b||c);d=b.style;y(a.attrSetters,{translateX:function(a){d.left=a+"px"},translateY:function(a){d.top=a+"px"},visibility:function(a,b){d[b]=a}})})}}else b=c;b.appendChild(g);e.added=!0;e.alignOnAdd&&e.htmlUpdateTransform();return e};return e},fontMetrics:function(a){var a=
C(a||11),a=a<24?a+4:r(a*1.2),b=r(a*0.8);return{h:a,b:b}},label:function(a,b,c,d,e,f,g,h,i){function j(){var a,b;a=O.element.style;p=(E===void 0||B===void 0||q.styles.textAlign)&&O.getBBox();q.width=(E||p.width||0)+2*N+fa;q.height=(B||p.height||0)+2*N;db=N+o.fontMetrics(a&&a.fontSize).b;if(A){if(!u)a=r(-x*N),b=h?-db:0,q.box=u=d?o.symbol(d,a,b,q.width,q.height):o.rect(a,b,q.width,q.height,0,wb[Yb]),u.add(q);u.isImg||u.attr(z({width:q.width,height:q.height},wb));wb=null}}function k(){var a=q.styles,
a=a&&a.textAlign,b=fa+N*(1-x),c;c=h?0:db;if(v(E)&&(a==="center"||a==="right"))b+={center:0.5,right:1}[a]*(E-p.width);(b!==O.x||c!==O.y)&&O.attr({x:b,y:c});O.x=b;O.y=c}function m(a,b){u?u.attr(a,b):wb[a]=b}function l(){O.add(q);q.attr({text:a,x:b,y:c});u&&v(e)&&q.attr({anchorX:e,anchorY:f})}var o=this,q=o.g(i),O=o.text("",0,0,g).attr({zIndex:1}),u,p,x=0,N=3,fa=0,E,B,T,t,J=0,wb={},db,g=q.attrSetters,A;F(q,"add",l);g.width=function(a){E=a;return!1};g.height=function(a){B=a;return!1};g.padding=function(a){v(a)&&
a!==N&&(N=a,k());return!1};g.paddingLeft=function(a){v(a)&&a!==fa&&(fa=a,k());return!1};g.align=function(a){x={left:0,center:0.5,right:1}[a];return!1};g.text=function(a,b){O.attr(b,a);j();k();return!1};g[Yb]=function(a,b){A=!0;J=a%2/2;m(b,a);return!1};g.stroke=g.fill=g.r=function(a,b){b==="fill"&&(A=!0);m(b,a);return!1};g.anchorX=function(a,b){e=a;m(b,a+J-T);return!1};g.anchorY=function(a,b){f=a;m(b,a-t);return!1};g.x=function(a){q.x=a;a-=x*((E||p.width)+N);T=r(a);q.attr("translateX",T);return!1};
g.y=function(a){t=q.y=r(a);q.attr("translateY",t);return!1};var C=q.css;return y(q,{css:function(a){if(a){var b={},a=z(a);n("fontSize,fontWeight,fontFamily,color,lineHeight,width,textDecoration".split(","),function(c){a[c]!==w&&(b[c]=a[c],delete a[c])});O.css(b)}return C.call(q,a)},getBBox:function(){return{width:p.width+2*N,height:p.height+2*N,x:p.x-N,y:p.y-N}},shadow:function(a){u&&u.shadow(a);return q},destroy:function(){X(q,"add",l);X(q.element,"mouseenter");X(q.element,"mouseleave");O&&(O=O.destroy());
u&&(u=u.destroy());Ca.prototype.destroy.call(q);q=o=j=k=m=l=null}})}};cb=Ga;var ib,Z;if(!ca&&!ia)Highcharts.VMLElement=Z={init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ","absolute",";"],e=b===Qa;(b==="shape"||e)&&d.push("left:0;top:0;width:1px;height:1px;");d.push("visibility: ",e?"hidden":"visible");c.push(' style="',d.join(""),'"/>');if(b)c=e||b==="span"||b==="img"?c.join(""):a.prepVML(c),this.element=aa(c);this.renderer=a;this.attrSetters={}},add:function(a){var b=this.renderer,
c=this.element,d=b.box,d=a?a.element||a:d;a&&a.inverted&&b.invertChild(c,d);d.appendChild(c);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();K(this,"add");return this},updateTransform:Ca.prototype.htmlUpdateTransform,attr:function(a,b){var c,d,e,f=this.element||{},g=f.style,h=f.nodeName,i=this.renderer,j=this.symbolName,k,m=this.shadows,l,o=this.attrSetters,q=this;ma(a)&&v(b)&&(c=a,a={},a[c]=b);if(ma(a))c=a,q=c==="strokeWidth"||c==="stroke-width"?this.strokeweight:
this[c];else for(c in a)if(d=a[c],l=!1,e=o[c]&&o[c].call(this,d,c),e!==!1&&d!==null){e!==w&&(d=e);if(j&&/^(x|y|r|start|end|width|height|innerR|anchorX|anchorY)/.test(c))k||(this.symbolAttr(a),k=!0),l=!0;else if(c==="d"){d=d||[];this.d=d.join(" ");e=d.length;l=[];for(var n;e--;)if(Ja(d[e]))l[e]=r(d[e]*10)-5;else if(d[e]==="Z")l[e]="x";else if(l[e]=d[e],d.isArc&&(d[e]==="wa"||d[e]==="at"))n=d[e]==="wa"?1:-1,l[e+5]===l[e+7]&&(l[e+7]-=n),l[e+6]===l[e+8]&&(l[e+8]-=n);d=l.join(" ")||"x";f.path=d;if(m)for(e=
m.length;e--;)m[e].path=m[e].cutOff?this.cutOffPath(d,m[e].cutOff):d;l=!0}else if(c==="visibility"){if(m)for(e=m.length;e--;)m[e].style[c]=d;h==="DIV"&&(d=d==="hidden"?"-999em":0,rb||(g[c]=d?"visible":"hidden"),c="top");g[c]=d;l=!0}else if(c==="zIndex")d&&(g[c]=d),l=!0;else if(va(c,["x","y","width","height"])!==-1)this[c]=d,c==="x"||c==="y"?c={x:"left",y:"top"}[c]:d=t(0,d),this.updateClipping?(this[c]=d,this.updateClipping()):g[c]=d,l=!0;else if(c==="class"&&h==="DIV")f.className=d;else if(c==="stroke")d=
i.color(d,f,c),c="strokecolor";else if(c==="stroke-width"||c==="strokeWidth")f.stroked=d?!0:!1,c="strokeweight",this[c]=d,Ja(d)&&(d+="px");else if(c==="dashstyle")(f.getElementsByTagName("stroke")[0]||aa(i.prepVML(["<stroke/>"]),null,null,f))[c]=d||"solid",this.dashstyle=d,l=!0;else if(c==="fill")if(h==="SPAN")g.color=d;else{if(h!=="IMG")f.filled=d!==ba?!0:!1,d=i.color(d,f,c,this),c="fillcolor"}else if(c==="opacity")l=!0;else if(h==="shape"&&c==="rotation")this[c]=d,f.style.left=-r(ka(d*qb)+1)+"px",
f.style.top=r(ha(d*qb))+"px";else if(c==="translateX"||c==="translateY"||c==="rotation")this[c]=d,this.updateTransform(),l=!0;else if(c==="text")this.bBox=null,f.innerHTML=d,l=!0;l||(rb?f[c]=d:G(f,c,d))}return q},clip:function(a){var b=this,c;a?(c=a.members,na(c,b),c.push(b),b.destroyClip=function(){na(c,b)},a=a.getCSS(b)):(b.destroyClip&&b.destroyClip(),a={clip:rb?"inherit":"rect(auto)"});return b.css(a)},css:Ca.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&Za(a)},destroy:function(){this.destroyClip&&
this.destroyClip();return Ca.prototype.destroy.apply(this)},on:function(a,b){this.element["on"+a]=function(){var a=Y.event;a.target=a.srcElement;b(a)};return this},cutOffPath:function(a,b){var c,a=a.split(/[ ,]/);c=a.length;if(c===9||c===11)a[c-4]=a[c-2]=C(a[c-2])-10*b;return a.join(" ")},shadow:function(a,b,c){var d=[],e,f=this.element,g=this.renderer,h,i=f.style,j,k=f.path,m,l,o,q;k&&typeof k.value!=="string"&&(k="x");l=k;if(a){o=p(a.width,3);q=(a.opacity||0.15)/o;for(e=1;e<=3;e++){m=o*2+1-2*e;
c&&(l=this.cutOffPath(k.value,m+0.5));j=['<shape isShadow="true" strokeweight="',m,'" filled="false" path="',l,'" coordsize="10 10" style="',f.style.cssText,'" />'];h=aa(g.prepVML(j),null,{left:C(i.left)+p(a.offsetX,1),top:C(i.top)+p(a.offsetY,1)});if(c)h.cutOff=m+1;j=['<stroke color="',a.color||"black",'" opacity="',q*e,'"/>'];aa(g.prepVML(j),null,null,h);b?b.element.appendChild(h):f.parentNode.insertBefore(h,f);d.push(h)}this.shadows=d}return this}},Z=ea(Ca,Z),Z={Element:Z,isIE8:Ta.indexOf("MSIE 8.0")>
-1,init:function(a,b,c){var d,e;this.alignedObjects=[];d=this.createElement(Qa);e=d.element;e.style.position="relative";a.appendChild(d.element);this.isVML=!0;this.box=e;this.boxWrapper=d;this.setSize(b,c,!1);if(!H.namespaces.hcv)H.namespaces.add("hcv","urn:schemas-microsoft-com:vml"),H.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "},isHidden:function(){return!this.box.offsetWidth},clipRect:function(a,b,c,d){var e=
this.createElement(),f=da(a);return y(e,{members:[],left:f?a.x:a,top:f?a.y:b,width:f?a.width:c,height:f?a.height:d,getCSS:function(a){var b=a.element,c=b.nodeName,a=a.inverted,d=this.top-(c==="shape"?b.offsetTop:0),e=this.left,b=e+this.width,f=d+this.height,d={clip:"rect("+r(a?e:d)+"px,"+r(a?f:b)+"px,"+r(a?b:f)+"px,"+r(a?d:e)+"px)"};!a&&rb&&c==="DIV"&&y(d,{width:b+"px",height:f+"px"});return d},updateClipping:function(){n(e.members,function(a){a.css(e.getCSS(a))})}})},color:function(a,b,c,d){var e=
this,f,g=/^rgba/,h,i,j=ba;a&&a.linearGradient?i="gradient":a&&a.radialGradient&&(i="pattern");if(i){var k,m,l=a.linearGradient||a.radialGradient,o,q,p,u,s,x="",a=a.stops,N,fa=[],E=function(){h=['<fill colors="'+fa.join(",")+'" opacity="',p,'" o:opacity2="',q,'" type="',i,'" ',x,'focus="100%" method="any" />'];aa(e.prepVML(h),null,null,b)};o=a[0];N=a[a.length-1];o[0]>0&&a.unshift([0,o[1]]);N[0]<1&&a.push([1,N[1]]);n(a,function(a,b){g.test(a[1])?(f=wa(a[1]),k=f.get("rgb"),m=f.get("a")):(k=a[1],m=1);
fa.push(a[0]*100+"% "+k);b?(p=m,u=k):(q=m,s=k)});if(c==="fill")if(i==="gradient")c=l.x1||l[0]||0,a=l.y1||l[1]||0,o=l.x2||l[2]||0,l=l.y2||l[3]||0,x='angle="'+(90-P.atan((l-a)/(o-c))*180/bb)+'"',E();else{var j=l.r,B=j*2,T=j*2,t=l.cx,w=l.cy,v=b.radialReference,r,j=function(){v&&(r=d.getBBox(),t+=(v[0]-r.x)/r.width-0.5,w+=(v[1]-r.y)/r.height-0.5,B*=v[2]/r.width,T*=v[2]/r.height);x='src="'+M.global.VMLRadialGradientURL+'" size="'+B+","+T+'" origin="0.5,0.5" position="'+t+","+w+'" color2="'+s+'" ';E()};
d.added?j():F(d,"add",j);j=u}else j=k}else if(g.test(a)&&b.tagName!=="IMG")f=wa(a),h=["<",c,' opacity="',f.get("a"),'"/>'],aa(this.prepVML(h),null,null,b),j=f.get("rgb");else{j=b.getElementsByTagName(c);if(j.length)j[0].opacity=1,j[0].type="solid";j=a}return j},prepVML:function(a){var b=this.isIE8,a=a.join("");b?(a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):a.replace('style="',
'style="display:inline-block;behavior:url(#default#VML);')):a=a.replace("<","<hcv:");return a},text:Ga.prototype.html,path:function(a){var b={coordsize:"10 10"};Wa(a)?b.d=a:da(a)&&y(b,a);return this.createElement("shape").attr(b)},circle:function(a,b,c){var d=this.symbol("circle");if(da(a))c=a.r,b=a.y,a=a.x;d.isCircle=!0;return d.attr({x:a,y:b,width:2*c,height:2*c})},g:function(a){var b;a&&(b={className:"highcharts-"+a,"class":"highcharts-"+a});return this.createElement(Qa).attr(b)},image:function(a,
b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.attr({x:b,y:c,width:d,height:e});return f},rect:function(a,b,c,d,e,f){if(da(a))b=a.y,c=a.width,d=a.height,f=a.strokeWidth,a=a.x;var g=this.symbol("rect");g.r=e;return g.attr(g.crisp(f,a,b,t(c,0),t(d,0)))},invertChild:function(a,b){var c=b.style;L(a,{flip:"x",left:C(c.width)-1,top:C(c.height)-1,rotation:-90})},symbols:{arc:function(a,b,c,d,e){var f=e.start,g=e.end,h=e.r||c||d,c=e.innerR,d=ha(f),i=ka(f),j=ha(g),k=ka(g);if(g-
f===0)return["x"];f=["wa",a-h,b-h,a+h,b+h,a+h*d,b+h*i,a+h*j,b+h*k];e.open&&!c&&f.push("e","M",a,b);f.push("at",a-c,b-c,a+c,b+c,a+c*j,b+c*k,a+c*d,b+c*i,"x","e");f.isArc=!0;return f},circle:function(a,b,c,d,e){e&&e.isCircle&&(a-=c/2,b-=d/2);return["wa",a,b,a+c,b+d,a+c,b+d/2,a+c,b+d/2,"e"]},rect:function(a,b,c,d,e){var f=a+c,g=b+d,h;!v(e)||!e.r?f=Ga.prototype.symbols.square.apply(0,arguments):(h=A(e.r,c,d),f=["M",a+h,b,"L",f-h,b,"wa",f-2*h,b,f,b+2*h,f-h,b,f,b+h,"L",f,g-h,"wa",f-2*h,g-2*h,f,g,f,g-h,f-
h,g,"L",a+h,g,"wa",a,g-2*h,a+2*h,g,a+h,g,a,g-h,"L",a,b+h,"wa",a,b,a+2*h,b+2*h,a,b+h,a+h,b,"x","e"]);return f}}},Highcharts.VMLRenderer=ib=function(){this.init.apply(this,arguments)},ib.prototype=z(Ga.prototype,Z),cb=ib;var $b;if(ia)Highcharts.CanVGRenderer=Z=function(){Ea="http://www.w3.org/1999/xhtml"},Z.prototype.symbols={},$b=function(){function a(){var a=b.length,d;for(d=0;d<a;d++)b[d]();b=[]}var b=[];return{push:function(c,d){b.length===0&&dc(d,a);b.push(c)}}}(),cb=Z;ab.prototype={addLabel:function(){var a=
this.axis,b=a.options,c=a.chart,d=a.horiz,e=a.categories,f=a.series[0]&&a.series[0].names,g=this.pos,h=b.labels,i=a.tickPositions,d=d&&e&&!h.step&&!h.staggerLines&&!h.rotation&&c.plotWidth/i.length||!d&&(c.optionsMarginLeft||c.plotWidth/2),j=g===i[0],k=g===i[i.length-1],f=e?p(e[g],f&&f[g],g):g,e=this.label,i=i.info,m;a.isDatetimeAxis&&i&&(m=b.dateTimeLabelFormats[i.higherRanks[g]||i.unitName]);this.isFirst=j;this.isLast=k;b=a.labelFormatter.call({axis:a,chart:c,isFirst:j,isLast:k,dateTimeLabelFormat:m,
value:a.isLog?oa(la(f)):f});g=d&&{width:t(1,r(d-2*(h.padding||10)))+"px"};g=y(g,h.style);if(v(e))e&&e.attr({text:b}).css(g);else{d={align:h.align};if(Ja(h.rotation))d.rotation=h.rotation;this.label=v(b)&&h.enabled?c.renderer.text(b,0,0,h.useHTML).attr(d).css(g).add(a.labelGroup):null}},getLabelSize:function(){var a=this.label,b=this.axis;return a?(this.labelBBox=a.getBBox())[b.horiz?"height":"width"]:0},getLabelSides:function(){var a=this.axis.options.labels,b=this.labelBBox.width,a=b*{left:0,center:0.5,
right:1}[a.align]-a.x;return[-a,b-a]},handleOverflow:function(a,b){var c=!0,d=this.axis,e=d.chart,f=this.isFirst,g=this.isLast,h=b.x,i=d.reversed,j=d.tickPositions;if(f||g){var k=this.getLabelSides(),m=k[0],k=k[1],e=e.plotLeft,l=e+d.len,j=(d=d.ticks[j[a+(f?1:-1)]])&&d.label.xy&&d.label.xy.x+d.getLabelSides()[f?0:1];f&&!i||g&&i?h+m<e&&(h=e-m,d&&h+k>j&&(c=!1)):h+k>l&&(h=l-k,d&&h+m<j&&(c=!1));b.x=h}return c},getPosition:function(a,b,c,d){var e=this.axis,f=e.chart,g=d&&f.oldChartHeight||f.chartHeight;
return{x:a?e.translate(b+c,null,null,d)+e.transB:e.left+e.offset+(e.opposite?(d&&f.oldChartWidth||f.chartWidth)-e.right-e.left:0),y:a?g-e.bottom+e.offset-(e.opposite?e.height:0):g-e.translate(b+c,null,null,d)-e.transB}},getLabelPosition:function(a,b,c,d,e,f,g,h){var i=this.axis,j=i.transA,k=i.reversed,i=i.staggerLines,a=a+e.x-(f&&d?f*j*(k?-1:1):0),b=b+e.y-(f&&!d?f*j*(k?1:-1):0);v(e.y)||(b+=C(c.styles.lineHeight)*0.9-c.getBBox().height/2);i&&(b+=g/(h||1)%i*16);return{x:a,y:b}},getMarkPath:function(a,
b,c,d,e,f){return f.crispLine(["M",a,b,"L",a+(e?0:-c),b+(e?c:0)],d)},render:function(a,b,c){var d=this.axis,e=d.options,f=d.chart.renderer,g=d.horiz,h=this.type,i=this.label,j=this.pos,k=e.labels,m=this.gridLine,l=h?h+"Grid":"grid",o=h?h+"Tick":"tick",q=e[l+"LineWidth"],n=e[l+"LineColor"],u=e[l+"LineDashStyle"],s=e[o+"Length"],l=e[o+"Width"]||0,x=e[o+"Color"],t=e[o+"Position"],o=this.mark,fa=k.step,E=!0,B=d.tickmarkOffset,T=this.getPosition(g,j,B,b),v=T.x,T=T.y,r=g&&v===d.pos||!g&&T===d.pos+d.len?
-1:1,z=d.staggerLines;this.isActive=!0;if(q){j=d.getPlotLinePath(j+B,q*r,b,!0);if(m===w){m={stroke:n,"stroke-width":q};if(u)m.dashstyle=u;if(!h)m.zIndex=1;if(b)m.opacity=0;this.gridLine=m=q?f.path(j).attr(m).add(d.gridGroup):null}if(!b&&m&&j)m[this.isNew?"attr":"animate"]({d:j,opacity:c})}if(l&&s)t==="inside"&&(s=-s),d.opposite&&(s=-s),b=this.getMarkPath(v,T,s,l*r,g,f),o?o.animate({d:b,opacity:c}):this.mark=f.path(b).attr({stroke:x,"stroke-width":l,opacity:c}).add(d.axisGroup);if(i&&!isNaN(v))i.xy=
T=this.getLabelPosition(v,T,i,g,k,B,a,fa),this.isFirst&&!p(e.showFirstLabel,1)||this.isLast&&!p(e.showLastLabel,1)?E=!1:!z&&g&&k.overflow==="justify"&&!this.handleOverflow(a,T)&&(E=!1),fa&&a%fa&&(E=!1),E&&!isNaN(T.y)?(T.opacity=c,i[this.isNew?"attr":"animate"](T),this.isNew=!1):i.attr("y",-9999)},destroy:function(){Aa(this,this.axis)}};Fb.prototype={render:function(){var a=this,b=a.axis,c=b.horiz,d=(b.pointRange||0)/2,e=a.options,f=e.label,g=a.label,h=e.width,i=e.to,j=e.from,k=v(j)&&v(i),m=e.value,
l=e.dashStyle,o=a.svgElem,q=[],n,u=e.color,s=e.zIndex,x=e.events,N=b.chart.renderer;b.isLog&&(j=ra(j),i=ra(i),m=ra(m));if(h){if(q=b.getPlotLinePath(m,h),d={stroke:u,"stroke-width":h},l)d.dashstyle=l}else if(k){if(j=t(j,b.min-d),i=A(i,b.max+d),q=b.getPlotBandPath(j,i,e),d={fill:u},e.borderWidth)d.stroke=e.borderColor,d["stroke-width"]=e.borderWidth}else return;if(v(s))d.zIndex=s;if(o)q?o.animate({d:q},null,o.onGetPath):(o.hide(),o.onGetPath=function(){o.show()});else if(q&&q.length&&(a.svgElem=o=N.path(q).attr(d).add(),
x))for(n in e=function(b){o.on(b,function(c){x[b].apply(a,[c])})},x)e(n);if(f&&v(f.text)&&q&&q.length&&b.width>0&&b.height>0){f=z({align:c&&k&&"center",x:c?!k&&4:10,verticalAlign:!c&&k&&"middle",y:c?k?16:10:k?6:-4,rotation:c&&!k&&90},f);if(!g)a.label=g=N.text(f.text,0,0).attr({align:f.textAlign||f.align,rotation:f.rotation,zIndex:s}).css(f.style).add();b=[q[1],q[4],p(q[6],q[1])];q=[q[2],q[5],p(q[7],q[2])];c=Pa(b);k=Pa(q);g.align(f,!1,{x:c,y:k,width:ua(b)-c,height:ua(q)-k});g.show()}else g&&g.hide();
return a},destroy:function(){na(this.axis.plotLinesAndBands,this);Aa(this,this.axis)}};Ub.prototype={destroy:function(){Aa(this,this.axis)},setTotal:function(a){this.cum=this.total=a},render:function(a){var b=this.options,c=b.format,c=c?La(c,this):b.formatter.call(this);this.label?this.label.attr({text:c,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(c,0,0,b.useHTML).css(b.style).attr({align:this.textAlign,rotation:b.rotation,visibility:"hidden"}).add(a)},setOffset:function(a,b){var c=
this.axis,d=c.chart,e=d.inverted,f=this.isNegative,g=c.translate(this.percent?100:this.total,0,0,0,1),c=c.translate(0),c=U(g-c),h=d.xAxis[0].translate(this.x)+a,i=d.plotHeight,f={x:e?f?g:g-c:h,y:e?i-h-b:f?i-g-c:i-g,width:e?c:b,height:e?b:c};if(e=this.label)e.align(this.alignOptions,null,f),f=e.alignAttr,e.attr({visibility:this.options.crop===!1||d.isInsidePlot(f.x,f.y)?ca?"inherit":"visible":"hidden"})}};Da.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",second:"%H:%M:%S",
minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,gridLineColor:"#C0C0C0",labels:D,lineColor:"#C0D0E0",lineWidth:1,minPadding:0.01,maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:5,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",tickWidth:1,title:{align:"middle",style:{color:"#4d759e",
fontWeight:"bold"}},type:"linear"},defaultYAxisOptions:{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{align:"right",x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:!0,tickWidth:0,title:{rotation:270,text:"Values"},stackLabels:{enabled:!1,formatter:function(){return xa(this.total,-1)},style:D.style}},defaultLeftAxisOptions:{labels:{align:"right",x:-8,y:null},title:{rotation:270}},defaultRightAxisOptions:{labels:{align:"left",x:8,y:null},title:{rotation:90}},
defaultBottomAxisOptions:{labels:{align:"center",x:0,y:14},title:{rotation:0}},defaultTopAxisOptions:{labels:{align:"center",x:0,y:-5},title:{rotation:0}},init:function(a,b){var c=b.isX;this.horiz=a.inverted?!c:c;this.xOrY=(this.isXAxis=c)?"x":"y";this.opposite=b.opposite;this.side=this.horiz?this.opposite?0:2:this.opposite?1:3;this.setOptions(b);var d=this.options,e=d.type;this.labelFormatter=d.labels.formatter||this.defaultLabelFormatter;this.staggerLines=this.horiz&&d.labels.staggerLines;this.userOptions=
b;this.minPixelPadding=0;this.chart=a;this.reversed=d.reversed;this.zoomEnabled=d.zoomEnabled!==!1;this.categories=d.categories||e==="category";this.isLog=e==="logarithmic";this.isDatetimeAxis=e==="datetime";this.isLinked=v(d.linkedTo);this.tickmarkOffset=this.categories&&d.tickmarkPlacement==="between"?0.5:0;this.ticks={};this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands={};this.len=0;this.minRange=this.userMinRange=d.minRange||d.maxZoom;this.range=d.range;this.offset=d.offset||0;
this.stacks={};this._stacksTouched=0;this.min=this.max=null;var f,d=this.options.events;va(this,a.axes)===-1&&(a.axes.push(this),a[c?"xAxis":"yAxis"].push(this));this.series=this.series||[];if(a.inverted&&c&&this.reversed===w)this.reversed=!0;this.removePlotLine=this.removePlotBand=this.removePlotBandOrLine;for(f in d)F(this,f,d[f]);if(this.isLog)this.val2lin=ra,this.lin2val=la},setOptions:function(a){this.options=z(this.defaultOptions,this.isXAxis?{}:this.defaultYAxisOptions,[this.defaultTopAxisOptions,
this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],z(M[this.isXAxis?"xAxis":"yAxis"],a))},update:function(a,b){var c=this.chart,a=c.options[this.xOrY+"Axis"][this.options.index]=z(this.userOptions,a);this.destroy();this._addedPlotLB=!1;this.init(c,a);c.isDirtyBox=!0;p(b,!0)&&c.redraw()},remove:function(a){var b=this.chart,c=this.xOrY+"Axis";n(this.series,function(a){a.remove(!1)});na(b.axes,this);na(b[c],this);b.options[c].splice(this.options.index,
1);n(b[c],function(a,b){a.options.index=b});this.destroy();b.isDirtyBox=!0;p(a,!0)&&b.redraw()},defaultLabelFormatter:function(){var a=this.axis,b=this.value,c=a.categories,d=this.dateTimeLabelFormat,e=M.lang.numericSymbols,f=e&&e.length,g,h=a.options.labels.format,a=a.isLog?b:a.tickInterval;if(h)g=La(h,this);else if(c)g=b;else if(d)g=ya(d,b);else if(f&&a>=1E3)for(;f--&&g===w;)c=Math.pow(1E3,f+1),a>=c&&e[f]!==null&&(g=xa(b/c,-1)+e[f]);g===w&&(g=b>=1E3?xa(b,0):xa(b,-1));return g},getSeriesExtremes:function(){var a=
this,b=a.chart,c=a.stacks,d=[],e=[],f=a._stacksTouched+=1,g,h;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=null;n(a.series,function(g){if(g.visible||!b.options.chart.ignoreHiddenSeries){var j=g.options,k,m,l,o,q,n,u,s,x,N=j.threshold,fa,E=[],B=0;a.hasVisibleSeries=!0;if(a.isLog&&N<=0)N=j.threshold=null;if(a.isXAxis){if(j=g.xData,j.length)a.dataMin=A(p(a.dataMin,j[0]),Pa(j)),a.dataMax=t(p(a.dataMax,j[0]),ua(j))}else{var T,r,J,z=g.cropped,y=g.xAxis.getExtremes(),C=!!g.modifyValue;k=j.stacking;a.usePercentage=
k==="percent";if(k)q=j.stack,o=g.type+p(q,""),n="-"+o,g.stackKey=o,m=d[o]||[],d[o]=m,l=e[n]||[],e[n]=l;if(a.usePercentage)a.dataMin=0,a.dataMax=99;j=g.processedXData;u=g.processedYData;fa=u.length;for(h=0;h<fa;h++){s=j[h];x=u[h];if(k)r=(T=x<N)?l:m,J=T?n:o,v(r[s])?(r[s]=oa(r[s]+x),x=[x,r[s]]):r[s]=x,c[J]||(c[J]={}),c[J][s]||(c[J][s]=new Ub(a,a.options.stackLabels,T,s,q,k)),c[J][s].setTotal(r[s]),c[J][s].touched=f;if(x!==null&&x!==w&&(!a.isLog||x.length||x>0))if(C&&(x=g.modifyValue(x)),g.getExtremesFromAll||
z||(j[h+1]||s)>=y.min&&(j[h-1]||s)<=y.max)if(s=x.length)for(;s--;)x[s]!==null&&(E[B++]=x[s]);else E[B++]=x}if(!a.usePercentage&&E.length)g.dataMin=k=Pa(E),g.dataMax=g=ua(E),a.dataMin=A(p(a.dataMin,k),k),a.dataMax=t(p(a.dataMax,g),g);if(v(N))if(a.dataMin>=N)a.dataMin=N,a.ignoreMinPadding=!0;else if(a.dataMax<N)a.dataMax=N,a.ignoreMaxPadding=!0}}});for(g in c)for(h in c[g])c[g][h].touched<f&&(c[g][h].destroy(),delete c[g][h])},translate:function(a,b,c,d,e,f){var g=this.len,h=1,i=0,j=d?this.oldTransA:
this.transA,d=d?this.oldMin:this.min,k=this.minPixelPadding,e=(this.options.ordinal||this.isLog&&e)&&this.lin2val;if(!j)j=this.transA;c&&(h*=-1,i=g);this.reversed&&(h*=-1,i-=h*g);b?(a=a*h+i,a-=k,a=a/j+d,e&&(a=this.lin2val(a))):(e&&(a=this.val2lin(a)),a=h*(a-d)*j+i+h*k+(f?j*this.pointRange/2:0));return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-(b?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,
b,c,d){var e=this.chart,f=this.left,g=this.top,h,i,j,a=this.translate(a,null,null,c),k=c&&e.oldChartHeight||e.chartHeight,m=c&&e.oldChartWidth||e.chartWidth,l;h=this.transB;c=i=r(a+h);h=j=r(k-a-h);if(isNaN(a))l=!0;else if(this.horiz){if(h=g,j=k-this.bottom,c<f||c>f+this.width)l=!0}else if(c=f,i=m-this.right,h<g||h>g+this.height)l=!0;return l&&!d?null:e.renderer.crispLine(["M",c,h,"L",i,j],b||0)},getPlotBandPath:function(a,b){var c=this.getPlotLinePath(b),d=this.getPlotLinePath(a);d&&c?d.push(c[4],
c[5],c[1],c[2]):d=null;return d},getLinearTickPositions:function(a,b,c){for(var d,b=oa(W(b/a)*a),c=oa(pa(c/a)*a),e=[];b<=c;){e.push(b);b=oa(b+a);if(b===d)break;d=b}return e},getLogTickPositions:function(a,b,c,d){var e=this.options,f=this.len,g=[];if(!d)this._minorAutoInterval=null;if(a>=0.5)a=r(a),g=this.getLinearTickPositions(a,b,c);else if(a>=0.08)for(var f=W(b),h,i,j,k,m,e=a>0.3?[1,2,4]:a>0.15?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];f<c+1&&!m;f++){i=e.length;for(h=0;h<i&&!m;h++)j=ra(la(f)*e[h]),j>b&&(!d||
k<=c)&&g.push(k),k>c&&(m=!0),k=j}else if(b=la(b),c=la(c),a=e[d?"minorTickInterval":"tickInterval"],a=p(a==="auto"?null:a,this._minorAutoInterval,(c-b)*(e.tickPixelInterval/(d?5:1))/((d?f/this.tickPositions.length:f)||1)),a=yb(a,null,P.pow(10,W(P.log(a)/P.LN10))),g=Fa(this.getLinearTickPositions(a,b,c),ra),!d)this._minorAutoInterval=a/5;if(!d)this.tickInterval=a;return g},getMinorTickPositions:function(){var a=this.options,b=this.tickPositions,c=this.minorTickInterval,d=[],e;if(this.isLog){e=b.length;
for(a=1;a<e;a++)d=d.concat(this.getLogTickPositions(c,b[a-1],b[a],!0))}else if(this.isDatetimeAxis&&a.minorTickInterval==="auto")d=d.concat(fb(zb(c),this.min,this.max,a.startOfWeek)),d[0]<this.min&&d.shift();else for(b=this.min+(b[0]-this.min)%c;b<=this.max;b+=c)d.push(b);return d},adjustForMinRange:function(){var a=this.options,b=this.min,c=this.max,d,e=this.dataMax-this.dataMin>=this.minRange,f,g,h,i,j;if(this.isXAxis&&this.minRange===w&&!this.isLog)v(a.min)||v(a.max)?this.minRange=null:(n(this.series,
function(a){i=a.xData;for(g=j=a.xIncrement?1:i.length-1;g>0;g--)if(h=i[g]-i[g-1],f===w||h<f)f=h}),this.minRange=A(f*5,this.dataMax-this.dataMin));if(c-b<this.minRange){var k=this.minRange;d=(k-c+b)/2;d=[b-d,p(a.min,b-d)];if(e)d[2]=this.dataMin;b=ua(d);c=[b+k,p(a.max,b+k)];if(e)c[2]=this.dataMax;c=Pa(c);c-b<k&&(d[0]=c-k,d[1]=p(a.min,c-k),b=ua(d))}this.min=b;this.max=c},setAxisTranslation:function(a){var b=this.max-this.min,c=0,d,e=0,f=0,g=this.linkedParent,h=this.transA;if(this.isXAxis)g?(e=g.minPointOffset,
f=g.pointRangePadding):n(this.series,function(a){var g=a.pointRange,h=a.options.pointPlacement,m=a.closestPointRange;g>b&&(g=0);c=t(c,g);e=t(e,h?0:g/2);f=t(f,h==="on"?0:g);!a.noSharedTooltip&&v(m)&&(d=v(d)?A(d,m):m)}),g=this.ordinalSlope&&d?this.ordinalSlope/d:1,this.minPointOffset=e*=g,this.pointRangePadding=f*=g,this.pointRange=A(c,b),this.closestPointRange=d;if(a)this.oldTransA=h;this.translationSlope=this.transA=h=this.len/(b+f||1);this.transB=this.horiz?this.left:this.bottom;this.minPixelPadding=
h*e},setTickPositions:function(a){var b=this,c=b.chart,d=b.options,e=b.isLog,f=b.isDatetimeAxis,g=b.isXAxis,h=b.isLinked,i=b.options.tickPositioner,j=d.maxPadding,k=d.minPadding,m=d.tickInterval,l=d.minTickInterval,o=d.tickPixelInterval,q=b.categories;h?(b.linkedParent=c[g?"xAxis":"yAxis"][d.linkedTo],c=b.linkedParent.getExtremes(),b.min=p(c.min,c.dataMin),b.max=p(c.max,c.dataMax),d.type!==b.linkedParent.options.type&&Ba(11,1)):(b.min=p(b.userMin,d.min,b.dataMin),b.max=p(b.userMax,d.max,b.dataMax));
if(e)!a&&A(b.min,p(b.dataMin,b.min))<=0&&Ba(10,1),b.min=oa(ra(b.min)),b.max=oa(ra(b.max));if(b.range&&(b.userMin=b.min=t(b.min,b.max-b.range),b.userMax=b.max,a))b.range=null;b.beforePadding&&b.beforePadding();b.adjustForMinRange();if(!q&&!b.usePercentage&&!h&&v(b.min)&&v(b.max)&&(c=b.max-b.min)){if(!v(d.min)&&!v(b.userMin)&&k&&(b.dataMin<0||!b.ignoreMinPadding))b.min-=c*k;if(!v(d.max)&&!v(b.userMax)&&j&&(b.dataMax>0||!b.ignoreMaxPadding))b.max+=c*j}b.tickInterval=b.min===b.max||b.min===void 0||b.max===
void 0?1:h&&!m&&o===b.linkedParent.options.tickPixelInterval?b.linkedParent.tickInterval:p(m,q?1:(b.max-b.min)*o/(b.len||1));g&&!a&&n(b.series,function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(!0);b.beforeSetTickPositions&&b.beforeSetTickPositions();if(b.postProcessTickInterval)b.tickInterval=b.postProcessTickInterval(b.tickInterval);if(!m&&b.tickInterval<l)b.tickInterval=l;if(!f&&!e&&(a=P.pow(10,W(P.log(b.tickInterval)/P.LN10)),!m))b.tickInterval=yb(b.tickInterval,
null,a,d);b.minorTickInterval=d.minorTickInterval==="auto"&&b.tickInterval?b.tickInterval/5:d.minorTickInterval;b.tickPositions=i=d.tickPositions?[].concat(d.tickPositions):i&&i.apply(b,[b.min,b.max]);if(!i)i=f?(b.getNonLinearTimeTicks||fb)(zb(b.tickInterval,d.units),b.min,b.max,d.startOfWeek,b.ordinalPositions,b.closestPointRange,!0):e?b.getLogTickPositions(b.tickInterval,b.min,b.max):b.getLinearTickPositions(b.tickInterval,b.min,b.max),b.tickPositions=i;if(!h)e=i[0],f=i[i.length-1],h=b.minPointOffset||
0,d.startOnTick?b.min=e:b.min-h>e&&i.shift(),d.endOnTick?b.max=f:b.max+h<f&&i.pop(),i.length===1&&(b.min-=0.001,b.max+=0.001)},setMaxTicks:function(){var a=this.chart,b=a.maxTicks||{},c=this.tickPositions,d=this._maxTicksKey=[this.xOrY,this.pos,this.len].join("-");if(!this.isLinked&&!this.isDatetimeAxis&&c&&c.length>(b[d]||0)&&this.options.alignTicks!==!1)b[d]=c.length;a.maxTicks=b},adjustTickAmount:function(){var a=this._maxTicksKey,b=this.tickPositions,c=this.chart.maxTicks;if(c&&c[a]&&!this.isDatetimeAxis&&
!this.categories&&!this.isLinked&&this.options.alignTicks!==!1){var d=this.tickAmount,e=b.length;this.tickAmount=a=c[a];if(e<a){for(;b.length<a;)b.push(oa(b[b.length-1]+this.tickInterval));this.transA*=(e-1)/(a-1);this.max=b[b.length-1]}if(v(d)&&a!==d)this.isDirty=!0}},setScale:function(){var a=this.stacks,b,c,d,e;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();e=this.len!==this.oldAxisLength;n(this.series,function(a){if(a.isDirtyData||a.isDirty||a.xAxis.isDirty)d=
!0});if(e||d||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax)if(this.forceRedraw=!1,this.getSeriesExtremes(),this.setTickPositions(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,!this.isDirty)this.isDirty=e||this.min!==this.oldMin||this.max!==this.oldMax;if(!this.isXAxis)for(b in a)for(c in a[b])a[b][c].cum=a[b][c].total;this.setMaxTicks()},setExtremes:function(a,b,c,d,e){var f=this,g=f.chart,c=p(c,!0),e=y(e,{min:a,max:b});K(f,"setExtremes",
e,function(){f.userMin=a;f.userMax=b;f.isDirtyExtremes=!0;c&&g.redraw(d)})},zoom:function(a,b){this.allowZoomOutside||(a<=this.dataMin&&(a=w),b>=this.dataMax&&(b=w));this.displayBtn=a!==w||b!==w;this.setExtremes(a,b,!1,w,{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,b=this.options,c=b.offsetLeft||0,d=b.offsetRight||0,e=this.horiz,f,g;this.left=g=p(b.left,a.plotLeft+c);this.top=f=p(b.top,a.plotTop);this.width=c=p(b.width,a.plotWidth-c+d);this.height=b=p(b.height,a.plotHeight);
this.bottom=a.chartHeight-b-f;this.right=a.chartWidth-c-g;this.len=t(e?c:b,0);this.pos=e?g:f},getExtremes:function(){var a=this.isLog;return{min:a?oa(la(this.min)):this.min,max:a?oa(la(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=this.isLog,c=b?la(this.min):this.min,b=b?la(this.max):this.max;c>a||a===null?a=c:b<a&&(a=b);return this.translate(a,0,1,0,1)},addPlotBand:function(a){this.addPlotBandOrLine(a,"plotBands")},
addPlotLine:function(a){this.addPlotBandOrLine(a,"plotLines")},addPlotBandOrLine:function(a,b){var c=(new Fb(this,a)).render(),d=this.userOptions;b&&(d[b]=d[b]||[],d[b].push(a));this.plotLinesAndBands.push(c);return c},getOffset:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,e=a.tickPositions,f=a.ticks,g=a.horiz,h=a.side,i=b.inverted?[1,0,3,2][h]:h,j,k=0,m,l=0,o=d.title,q=d.labels,O=0,u=b.axisOffset,s=b.clipOffset,x=[-1,1,1,-1][h],r;a.hasData=b=a.hasVisibleSeries||v(a.min)&&v(a.max)&&!!e;
a.showAxis=j=b||p(d.showEmpty,!0);if(!a.axisGroup)a.gridGroup=c.g("grid").attr({zIndex:d.gridZIndex||1}).add(),a.axisGroup=c.g("axis").attr({zIndex:d.zIndex||2}).add(),a.labelGroup=c.g("axis-labels").attr({zIndex:q.zIndex||7}).add();if(b||a.isLinked)n(e,function(b){f[b]?f[b].addLabel():f[b]=new ab(a,b)}),n(e,function(a){if(h===0||h===2||{1:"left",3:"right"}[h]===q.align)O=t(f[a].getLabelSize(),O)}),a.staggerLines&&(O+=(a.staggerLines-1)*16);else for(r in f)f[r].destroy(),delete f[r];if(o&&o.text&&
o.enabled!==!1){if(!a.axisTitle)a.axisTitle=c.text(o.text,0,0,o.useHTML).attr({zIndex:7,rotation:o.rotation||0,align:o.textAlign||{low:"left",middle:"center",high:"right"}[o.align]}).css(o.style).add(a.axisGroup),a.axisTitle.isNew=!0;if(j)k=a.axisTitle.getBBox()[g?"height":"width"],l=p(o.margin,g?5:10),m=o.offset;a.axisTitle[j?"show":"hide"]()}a.offset=x*p(d.offset,u[h]);a.axisTitleMargin=p(m,O+l+(h!==2&&O&&x*d.labels[g?"y":"x"]));u[h]=t(u[h],a.axisTitleMargin+k+x*a.offset);s[i]=t(s[i],d.lineWidth)},
getLinePath:function(a){var b=this.chart,c=this.opposite,d=this.offset,e=this.horiz,f=this.left+(c?this.width:0)+d;this.lineTop=d=b.chartHeight-this.bottom-(c?this.height:0)+d;c||(a*=-1);return b.renderer.crispLine(["M",e?this.left:f,e?d:this.top,"L",e?b.chartWidth-this.right:f,e?d:b.chartHeight-this.bottom],a)},getTitlePosition:function(){var a=this.horiz,b=this.left,c=this.top,d=this.len,e=this.options.title,f=a?b:c,g=this.opposite,h=this.offset,i=C(e.style.fontSize||12),d={low:f+(a?0:d),middle:f+
d/2,high:f+(a?d:0)}[e.align],b=(a?c+this.height:b)+(a?1:-1)*(g?-1:1)*this.axisTitleMargin+(this.side===2?i:0);return{x:a?d:b+(g?this.width:0)+h+(e.x||0),y:a?b-(g?this.height:0)+h:d+(e.y||0)}},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,e=a.isLog,f=a.isLinked,g=a.tickPositions,h=a.axisTitle,i=a.stacks,j=a.ticks,k=a.minorTicks,m=a.alternateBands,l=d.stackLabels,o=d.alternateGridColor,q=a.tickmarkOffset,p=d.lineWidth,u,s=b.hasRendered&&v(a.oldMin)&&!isNaN(a.oldMin);u=a.hasData;var x=
a.showAxis,r,t;n([j,k,m],function(a){for(var b in a)a[b].isActive=!1});if(u||f)if(a.minorTickInterval&&!a.categories&&n(a.getMinorTickPositions(),function(b){k[b]||(k[b]=new ab(a,b,"minor"));s&&k[b].isNew&&k[b].render(null,!0);k[b].render(null,!1,1)}),g.length&&(n(g.slice(1).concat([g[0]]),function(b,c){c=c===g.length-1?0:c+1;if(!f||b>=a.min&&b<=a.max)j[b]||(j[b]=new ab(a,b)),s&&j[b].isNew&&j[b].render(c,!0),j[b].render(c,!1,1)}),q&&a.min===0&&(j[-1]||(j[-1]=new ab(a,-1,null,!0)),j[-1].render(-1))),
o&&n(g,function(b,c){if(c%2===0&&b<a.max)m[b]||(m[b]=new Fb(a)),r=b+q,t=g[c+1]!==w?g[c+1]+q:a.max,m[b].options={from:e?la(r):r,to:e?la(t):t,color:o},m[b].render(),m[b].isActive=!0}),!a._addedPlotLB)n((d.plotLines||[]).concat(d.plotBands||[]),function(b){a.addPlotBandOrLine(b)}),a._addedPlotLB=!0;n([j,k,m],function(a){var c,d,e=[],f=Ra?Ra.duration||500:0,g=function(){for(d=e.length;d--;)a[e[d]]&&!a[e[d]].isActive&&(a[e[d]].destroy(),delete a[e[d]])};for(c in a)if(!a[c].isActive)a[c].render(c,!1,0),
a[c].isActive=!1,e.push(c);a===m||!b.hasRendered||!f?g():f&&setTimeout(g,f)});if(p)u=a.getLinePath(p),a.axisLine?a.axisLine.animate({d:u}):a.axisLine=c.path(u).attr({stroke:d.lineColor,"stroke-width":p,zIndex:7}).add(a.axisGroup),a.axisLine[x?"show":"hide"]();if(h&&x)h[h.isNew?"attr":"animate"](a.getTitlePosition()),h.isNew=!1;if(l&&l.enabled){var E,B,d=a.stackTotalGroup;if(!d)a.stackTotalGroup=d=c.g("stack-labels").attr({visibility:"visible",zIndex:6}).add();d.translate(b.plotLeft,b.plotTop);for(E in i)for(B in c=
i[E],c)c[B].render(d)}a.isDirty=!1},removePlotBandOrLine:function(a){for(var b=this.plotLinesAndBands,c=b.length;c--;)b[c].id===a&&b[c].destroy()},setTitle:function(a,b){this.update({title:a},b)},redraw:function(){var a=this.chart.pointer;a.reset&&a.reset(!0);this.render();n(this.plotLinesAndBands,function(a){a.render()});n(this.series,function(a){a.isDirty=!0})},setCategories:function(a,b){this.update({categories:a},b)},destroy:function(){var a=this,b=a.stacks,c;X(a);for(c in b)Aa(b[c]),b[c]=null;
n([a.ticks,a.minorTicks,a.alternateBands,a.plotLinesAndBands],function(a){Aa(a)});n("stackTotalGroup,axisLine,axisGroup,gridGroup,labelGroup,axisTitle".split(","),function(b){a[b]&&(a[b]=a[b].destroy())})}};Gb.prototype={init:function(a,b){var c=b.borderWidth,d=b.style,e=C(d.padding);this.chart=a;this.options=b;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.label=a.renderer.label("",0,0,b.shape,null,null,b.useHTML,null,"tooltip").attr({padding:e,fill:b.backgroundColor,"stroke-width":c,
r:b.borderRadius,zIndex:8}).css(d).css({padding:0}).hide().add();ia||this.label.shadow(b.shadow);this.shared=b.shared},destroy:function(){n(this.crosshairs,function(a){a&&a.destroy()});if(this.label)this.label=this.label.destroy();clearTimeout(this.hideTimer);clearTimeout(this.tooltipTimeout)},move:function(a,b,c,d){var e=this,f=e.now,g=e.options.animation!==!1&&!e.isHidden;y(f,{x:g?(2*f.x+a)/3:a,y:g?(f.y+b)/2:b,anchorX:g?(2*f.anchorX+c)/3:c,anchorY:g?(f.anchorY+d)/2:d});e.label.attr(f);if(g&&(U(a-
f.x)>1||U(b-f.y)>1))clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(a,b,c,d)},32)},hide:function(){var a=this,b;clearTimeout(this.hideTimer);if(!this.isHidden)b=this.chart.hoverPoints,this.hideTimer=setTimeout(function(){a.label.fadeOut();a.isHidden=!0},p(this.options.hideDelay,500)),b&&n(b,function(a){a.setState()}),this.chart.hoverPoints=null},hideCrosshairs:function(){n(this.crosshairs,function(a){a&&a.hide()})},getAnchor:function(a,b){var c,d=this.chart,e=
d.inverted,f=d.plotTop,g=0,h=0,i,a=ja(a);c=a[0].tooltipPos;this.followPointer&&b&&(b.chartX===w&&(b=d.pointer.normalize(b)),c=[b.chartX-d.plotLeft,b.chartY-f]);c||(n(a,function(a){i=a.series.yAxis;g+=a.plotX;h+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!e&&i?i.top-f:0)}),g/=a.length,h/=a.length,c=[e?d.plotWidth-h:g,this.shared&&!e&&a.length>1&&b?b.chartY-f:e?d.plotHeight-g:h]);return Fa(c,r)},getPosition:function(a,b,c){var d=this.chart,e=d.plotLeft,f=d.plotTop,g=d.plotWidth,h=d.plotHeight,i=
p(this.options.distance,12),j=c.plotX,c=c.plotY,d=j+e+(d.inverted?i:-a-i),k=c-b+f+15,m;d<7&&(d=e+t(j,0)+i);d+a>e+g&&(d-=d+a-(e+g),k=c-b+f-i,m=!0);k<f+5&&(k=f+5,m&&c>=k&&c<=k+b&&(k=c+f+i));k+b>f+h&&(k=t(f,f+h-b-i));return{x:d,y:k}},defaultFormatter:function(a){var b=this.points||ja(this),c=b[0].series,d;d=[c.tooltipHeaderFormatter(b[0])];n(b,function(a){c=a.series;d.push(c.tooltipFormatter&&c.tooltipFormatter(a)||a.point.tooltipFormatter(c.tooltipOptions.pointFormat))});d.push(a.options.footerFormat||
"");return d.join("")},refresh:function(a,b){var c=this.chart,d=this.label,e=this.options,f,g,h,i={},j,k=[];j=e.formatter||this.defaultFormatter;var i=c.hoverPoints,m,l=e.crosshairs;h=this.shared;clearTimeout(this.hideTimer);this.followPointer=ja(a)[0].series.tooltipOptions.followPointer;g=this.getAnchor(a,b);f=g[0];g=g[1];h&&(!a.series||!a.series.noSharedTooltip)?(c.hoverPoints=a,i&&n(i,function(a){a.setState()}),n(a,function(a){a.setState("hover");k.push(a.getLabelConfig())}),i={x:a[0].category,
y:a[0].y},i.points=k,a=a[0]):i=a.getLabelConfig();j=j.call(i,this);i=a.series;h=h||!i.isCartesian||i.tooltipOutsidePlot||c.isInsidePlot(f,g);j===!1||!h?this.hide():(this.isHidden&&(hb(d),d.attr("opacity",1).show()),d.attr({text:j}),m=e.borderColor||a.color||i.color||"#606060",d.attr({stroke:m}),this.updatePosition({plotX:f,plotY:g}),this.isHidden=!1);if(l){l=ja(l);for(d=l.length;d--;)if(e=a.series[d?"yAxis":"xAxis"],l[d]&&e)if(h=d?p(a.stackY,a.y):a.x,e.isLog&&(h=ra(h)),e=e.getPlotLinePath(h,1),this.crosshairs[d])this.crosshairs[d].attr({d:e,
visibility:"visible"});else{h={"stroke-width":l[d].width||1,stroke:l[d].color||"#C0C0C0",zIndex:l[d].zIndex||2};if(l[d].dashStyle)h.dashstyle=l[d].dashStyle;this.crosshairs[d]=c.renderer.path(e).attr(h).add()}}K(c,"tooltipRefresh",{text:j,x:f+c.plotLeft,y:g+c.plotTop,borderColor:m})},updatePosition:function(a){var b=this.chart,c=this.label,c=(this.options.positioner||this.getPosition).call(this,c.width,c.height,a);this.move(r(c.x),r(c.y),a.plotX+b.plotLeft,a.plotY+b.plotTop)}};pb.prototype={init:function(a,
b){var c=ia?"":b.chart.zoomType,d=a.inverted,e;this.options=b;this.chart=a;this.zoomX=e=/x/.test(c);this.zoomY=c=/y/.test(c);this.zoomHor=e&&!d||c&&d;this.zoomVert=c&&!d||e&&d;this.pinchDown=[];this.lastValidTouch={};if(b.tooltip.enabled)a.tooltip=new Gb(a,b.tooltip);this.setDOMEvents()},normalize:function(a){var b,c,d,a=a||Y.event;if(!a.target)a.target=a.srcElement;a=Zb(a);d=a.touches?a.touches.item(0):a;this.chartPosition=b=ec(this.chart.container);d.pageX===w?(c=a.x,b=a.y):(c=d.pageX-b.left,b=
d.pageY-b.top);return y(a,{chartX:r(c),chartY:r(b)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};n(this.chart.axes,function(c){b[c.isXAxis?"xAxis":"yAxis"].push({axis:c,value:c.toValue(a[c.horiz?"chartX":"chartY"])})});return b},getIndex:function(a){var b=this.chart;return b.inverted?b.plotHeight+b.plotTop-a.chartY:a.chartX-b.plotLeft},runPointActions:function(a){var b=this.chart,c=b.series,d=b.tooltip,e,f=b.hoverPoint,g=b.hoverSeries,h,i,j=b.chartWidth,k=this.getIndex(a);if(d&&this.options.tooltip.shared&&
(!g||!g.noSharedTooltip)){e=[];h=c.length;for(i=0;i<h;i++)if(c[i].visible&&c[i].options.enableMouseTracking!==!1&&!c[i].noSharedTooltip&&c[i].tooltipPoints.length&&(b=c[i].tooltipPoints[k],b.series))b._dist=U(k-b.clientX),j=A(j,b._dist),e.push(b);for(h=e.length;h--;)e[h]._dist>j&&e.splice(h,1);if(e.length&&e[0].clientX!==this.hoverX)d.refresh(e,a),this.hoverX=e[0].clientX}if(g&&g.tracker){if((b=g.tooltipPoints[k])&&b!==f)b.onMouseOver(a)}else d&&d.followPointer&&!d.isHidden&&(a=d.getAnchor([{}],a),
d.updatePosition({plotX:a[0],plotY:a[1]}))},reset:function(a){var b=this.chart,c=b.hoverSeries,d=b.hoverPoint,e=b.tooltip,b=e&&e.shared?b.hoverPoints:d;(a=a&&e&&b)&&ja(b)[0].plotX===w&&(a=!1);if(a)e.refresh(b);else{if(d)d.onMouseOut();if(c)c.onMouseOut();e&&(e.hide(),e.hideCrosshairs());this.hoverX=null}},scaleGroups:function(a,b){var c=this.chart;n(c.series,function(d){d.xAxis&&d.xAxis.zoomEnabled&&(d.group.attr(a),d.markerGroup&&(d.markerGroup.attr(a),d.markerGroup.clip(b?c.clipRect:null)),d.dataLabelsGroup&&
d.dataLabelsGroup.attr(a))});c.clipRect.attr(b||c.clipBox)},pinchTranslateDirection:function(a,b,c,d,e,f,g){var h=this.chart,i=a?"x":"y",j=a?"X":"Y",k="chart"+j,m=a?"width":"height",l=h["plot"+(a?"Left":"Top")],o,q,n=1,p=h.inverted,s=h.bounds[a?"h":"v"],x=b.length===1,r=b[0][k],t=c[0][k],E=!x&&b[1][k],B=!x&&c[1][k],v,c=function(){!x&&U(r-E)>20&&(n=U(t-B)/U(r-E));q=(l-t)/n+r;o=h["plot"+(a?"Width":"Height")]/n};c();b=q;b<s.min?(b=s.min,v=!0):b+o>s.max&&(b=s.max-o,v=!0);v?(t-=0.8*(t-g[i][0]),x||(B-=
0.8*(B-g[i][1])),c()):g[i]=[t,B];p||(f[i]=q-l,f[m]=o);f=p?1/n:n;e[m]=o;e[i]=b;d[p?a?"scaleY":"scaleX":"scale"+j]=n;d["translate"+j]=f*l+(t-f*r)},pinch:function(a){var b=this,c=b.chart,d=b.pinchDown,e=c.tooltip&&c.tooltip.options.followTouchMove,f=a.touches,g=f.length,h=b.lastValidTouch,i=b.zoomHor||b.pinchHor,j=b.zoomVert||b.pinchVert,k=i||j,m=b.selectionMarker,l={},o={};a.type==="touchstart"&&(e||k)&&a.preventDefault();Fa(f,function(a){return b.normalize(a)});if(a.type==="touchstart")n(f,function(a,
b){d[b]={chartX:a.chartX,chartY:a.chartY}}),h.x=[d[0].chartX,d[1]&&d[1].chartX],h.y=[d[0].chartY,d[1]&&d[1].chartY],n(c.axes,function(a){if(a.zoomEnabled){var b=c.bounds[a.horiz?"h":"v"],d=a.minPixelPadding,e=a.toPixels(a.dataMin),f=a.toPixels(a.dataMax),g=A(e,f),e=t(e,f);b.min=A(a.pos,g-d);b.max=t(a.pos+a.len,e+d)}});else if(d.length){if(!m)b.selectionMarker=m=y({destroy:qa},c.plotBox);i&&b.pinchTranslateDirection(!0,d,f,l,m,o,h);j&&b.pinchTranslateDirection(!1,d,f,l,m,o,h);b.hasPinched=k;b.scaleGroups(l,
o);!k&&e&&g===1&&this.runPointActions(b.normalize(a))}},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;this.mouseDownY=a.chartY},drag:function(a){var b=this.chart,c=b.options.chart,d=a.chartX,a=a.chartY,e=this.zoomHor,f=this.zoomVert,g=b.plotLeft,h=b.plotTop,i=b.plotWidth,j=b.plotHeight,k,m=this.mouseDownX,l=this.mouseDownY;d<g?d=g:d>g+i&&(d=g+i);a<h?a=h:a>h+j&&(a=h+j);this.hasDragged=Math.sqrt(Math.pow(m-d,2)+Math.pow(l-a,2));if(this.hasDragged>
10){k=b.isInsidePlot(m-g,l-h);if(b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&k&&!this.selectionMarker)this.selectionMarker=b.renderer.rect(g,h,e?1:i,f?1:j,0).attr({fill:c.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add();this.selectionMarker&&e&&(e=d-m,this.selectionMarker.attr({width:U(e),x:(e>0?0:e)+m}));this.selectionMarker&&f&&(e=a-l,this.selectionMarker.attr({height:U(e),y:(e>0?0:e)+l}));k&&!this.selectionMarker&&c.panning&&b.pan(d)}},drop:function(a){var b=this.chart,c=this.hasPinched;
if(this.selectionMarker){var d={xAxis:[],yAxis:[],originalEvent:a.originalEvent||a},e=this.selectionMarker,f=e.x,g=e.y,h;if(this.hasDragged||c)n(b.axes,function(a){if(a.zoomEnabled){var b=a.horiz,c=a.toValue(b?f:g),b=a.toValue(b?f+e.width:g+e.height);!isNaN(c)&&!isNaN(b)&&(d[a.xOrY+"Axis"].push({axis:a,min:A(c,b),max:t(c,b)}),h=!0)}}),h&&K(b,"selection",d,function(a){b.zoom(y(a,c?{animation:!1}:null))});this.selectionMarker=this.selectionMarker.destroy();c&&this.scaleGroups({translateX:b.plotLeft,
translateY:b.plotTop,scaleX:1,scaleY:1})}if(b)L(b.container,{cursor:b._cursor}),b.cancelClick=this.hasDragged>10,b.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[]},onContainerMouseDown:function(a){a=this.normalize(a);a.preventDefault&&a.preventDefault();this.dragStart(a)},onDocumentMouseUp:function(a){this.drop(a)},onDocumentMouseMove:function(a){var b=this.chart,c=this.chartPosition,d=b.hoverSeries,a=Zb(a);c&&d&&d.isCartesian&&!b.isInsidePlot(a.pageX-c.left-b.plotLeft,a.pageY-c.top-
b.plotTop)&&this.reset()},onContainerMouseLeave:function(){this.reset();this.chartPosition=null},onContainerMouseMove:function(a){var b=this.chart,a=this.normalize(a);a.returnValue=!1;b.mouseIsDown==="mousedown"&&this.drag(a);b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)&&!b.openMenu&&this.runPointActions(a)},inClass:function(a,b){for(var c;a;){if(c=G(a,"class"))if(c.indexOf(b)!==-1)return!0;else if(c.indexOf("highcharts-container")!==-1)return!1;a=a.parentNode}},onTrackerMouseOut:function(a){var b=
this.chart.hoverSeries;if(b&&!b.options.stickyTracking&&!this.inClass(a.toElement||a.relatedTarget,"highcharts-tooltip"))b.onMouseOut()},onContainerClick:function(a){var b=this.chart,c=b.hoverPoint,d=b.plotLeft,e=b.plotTop,f=b.inverted,g,h,i,a=this.normalize(a);a.cancelBubble=!0;if(!b.cancelClick)c&&this.inClass(a.target,"highcharts-tracker")?(g=this.chartPosition,h=c.plotX,i=c.plotY,y(c,{pageX:g.left+d+(f?b.plotWidth-i:h),pageY:g.top+e+(f?b.plotHeight-h:i)}),K(c.series,"click",y(a,{point:c})),b.hoverPoint&&
c.firePointEvent("click",a)):(y(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-d,a.chartY-e)&&K(b,"click",a))},onContainerTouchStart:function(a){var b=this.chart;a.touches.length===1?(a=this.normalize(a),b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)&&(this.runPointActions(a),this.pinch(a))):a.touches.length===2&&this.pinch(a)},onContainerTouchMove:function(a){(a.touches.length===1||a.touches.length===2)&&this.pinch(a)},onDocumentTouchEnd:function(a){this.drop(a)},setDOMEvents:function(){var a=
this,b=a.chart.container,c;this._events=c=[[b,"onmousedown","onContainerMouseDown"],[b,"onmousemove","onContainerMouseMove"],[b,"onclick","onContainerClick"],[b,"mouseleave","onContainerMouseLeave"],[H,"mousemove","onDocumentMouseMove"],[H,"mouseup","onDocumentMouseUp"]];gb&&c.push([b,"ontouchstart","onContainerTouchStart"],[b,"ontouchmove","onContainerTouchMove"],[H,"touchend","onDocumentTouchEnd"]);n(c,function(b){a["_"+b[2]]=function(c){a[b[2]](c)};b[1].indexOf("on")===0?b[0][b[1]]=a["_"+b[2]]:
F(b[0],b[1],a["_"+b[2]])})},destroy:function(){var a=this;n(a._events,function(b){b[1].indexOf("on")===0?b[0][b[1]]=null:X(b[0],b[1],a["_"+b[2]])});delete a._events;clearInterval(a.tooltipTimeout)}};Hb.prototype={init:function(a,b){var c=this,d=b.itemStyle,e=p(b.padding,8),f=b.itemMarginTop||0;this.options=b;if(b.enabled)c.baseline=C(d.fontSize)+3+f,c.itemStyle=d,c.itemHiddenStyle=z(d,b.itemHiddenStyle),c.itemMarginTop=f,c.padding=e,c.initialItemX=e,c.initialItemY=e-5,c.maxItemWidth=0,c.chart=a,c.itemHeight=
0,c.lastLineHeight=0,c.render(),F(c.chart,"endResize",function(){c.positionCheckboxes()})},colorizeItem:function(a,b){var c=this.options,d=a.legendItem,e=a.legendLine,f=a.legendSymbol,g=this.itemHiddenStyle.color,c=b?c.itemStyle.color:g,h=b?a.color:g,g=a.options&&a.options.marker,i={stroke:h,fill:h},j;d&&d.css({fill:c,color:c});e&&e.attr({stroke:h});if(f){if(g)for(j in g=a.convertAttribs(g),g)d=g[j],d!==w&&(i[j]=d);f.attr(i)}},positionItem:function(a){var b=this.options,c=b.symbolPadding,b=!b.rtl,
d=a._legendItemPos,e=d[0],d=d[1],f=a.checkbox;a.legendGroup&&a.legendGroup.translate(b?e:this.legendWidth-e-2*c-4,d);if(f)f.x=e,f.y=d},destroyItem:function(a){var b=a.checkbox;n(["legendItem","legendLine","legendSymbol","legendGroup"],function(b){a[b]&&a[b].destroy()});b&&Za(a.checkbox)},destroy:function(){var a=this.group,b=this.box;if(b)this.box=b.destroy();if(a)this.group=a.destroy()},positionCheckboxes:function(a){var b=this.group.alignAttr,c,d=this.clipHeight||this.legendHeight;if(b)c=b.translateY,
n(this.allItems,function(e){var f=e.checkbox,g;f&&(g=c+f.y+(a||0)+3,L(f,{left:b.translateX+e.legendItemWidth+f.x-20+"px",top:g+"px",display:g>c-6&&g<c+d-6?"":ba}))})},renderTitle:function(){var a=this.padding,b=this.options.title,c=0;if(b.text){if(!this.title)this.title=this.chart.renderer.label(b.text,a-3,a-4,null,null,null,null,null,"legend-title").attr({zIndex:1}).css(b.style).add(this.group);c=this.title.getBBox().height;this.contentGroup.attr({translateY:c})}this.titleHeight=c},renderItem:function(a){var u;
var b=this,c=b.chart,d=c.renderer,e=b.options,f=e.layout==="horizontal",g=e.symbolWidth,h=e.symbolPadding,i=b.itemStyle,j=b.itemHiddenStyle,k=b.padding,m=!e.rtl,l=e.width,o=e.itemMarginBottom||0,q=b.itemMarginTop,n=b.initialItemX,p=a.legendItem,s=a.series||a,x=s.options,r=x.showCheckbox,v=e.useHTML;if(!p&&(a.legendGroup=d.g("legend-item").attr({zIndex:1}).add(b.scrollGroup),s.drawLegendSymbol(b,a),a.legendItem=p=d.text(e.labelFormat?La(e.labelFormat,a):e.labelFormatter.call(a),m?g+h:-h,b.baseline,
v).css(z(a.visible?i:j)).attr({align:m?"left":"right",zIndex:2}).add(a.legendGroup),(v?p:a.legendGroup).on("mouseover",function(){a.setState("hover");p.css(b.options.itemHoverStyle)}).on("mouseout",function(){p.css(a.visible?i:j);a.setState()}).on("click",function(b){var c=function(){a.setVisible()},b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,c):K(a,"legendItemClick",b,c)}),b.colorizeItem(a,a.visible),x&&r))a.checkbox=aa("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},
e.itemCheckboxStyle,c.container),F(a.checkbox,"click",function(b){K(a,"checkboxClick",{checked:b.target.checked},function(){a.select()})});d=p.getBBox();u=a.legendItemWidth=e.itemWidth||g+h+d.width+k+(r?20:0),e=u;b.itemHeight=g=d.height;if(f&&b.itemX-n+e>(l||c.chartWidth-2*k-n))b.itemX=n,b.itemY+=q+b.lastLineHeight+o,b.lastLineHeight=0;b.maxItemWidth=t(b.maxItemWidth,e);b.lastItemY=q+b.itemY+o;b.lastLineHeight=t(g,b.lastLineHeight);a._legendItemPos=[b.itemX,b.itemY];f?b.itemX+=e:(b.itemY+=q+g+o,b.lastLineHeight=
g);b.offsetWidth=l||t(f?b.itemX-n:e,b.offsetWidth)},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.group,e,f,g,h,i=a.box,j=a.options,k=a.padding,m=j.borderWidth,l=j.backgroundColor;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=0;if(!d)a.group=d=c.g("legend").attr({zIndex:7}).add(),a.contentGroup=c.g().attr({zIndex:1}).add(d),a.scrollGroup=c.g().add(a.contentGroup);a.renderTitle();e=[];n(b.series,function(a){var b=a.options;b.showInLegend&&!v(b.linkedTo)&&(e=e.concat(a.legendItems||
(b.legendType==="point"?a.data:a)))});Sb(e,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});j.reversed&&e.reverse();a.allItems=e;a.display=f=!!e.length;n(e,function(b){a.renderItem(b)});g=j.width||a.offsetWidth;h=a.lastItemY+a.lastLineHeight+a.titleHeight;h=a.handleOverflow(h);if(m||l){g+=k;h+=k;if(i){if(g>0&&h>0)i[i.isNew?"attr":"animate"](i.crisp(null,null,null,g,h)),i.isNew=!1}else a.box=i=c.rect(0,0,g,h,j.borderRadius,m||0).attr({stroke:j.borderColor,
"stroke-width":m||0,fill:l||ba}).add(d).shadow(j.shadow),i.isNew=!0;i[f?"show":"hide"]()}a.legendWidth=g;a.legendHeight=h;n(e,function(b){a.positionItem(b)});f&&d.align(y({width:g,height:h},j),!0,"spacingBox");b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,c=this.chart,d=c.renderer,e=this.options,f=e.y,f=c.spacingBox.height+(e.verticalAlign==="top"?-f:f)-this.padding,g=e.maxHeight,h=this.clipRect,i=e.navigation,j=p(i.animation,!0),k=i.arrowSize||12,m=this.nav;e.layout===
"horizontal"&&(f/=2);g&&(f=A(f,g));if(a>f&&!e.useHTML){this.clipHeight=c=f-20-this.titleHeight;this.pageCount=pa(a/c);this.currentPage=p(this.currentPage,1);this.fullHeight=a;if(!h)h=b.clipRect=d.clipRect(0,0,9999,0),b.contentGroup.clip(h);h.attr({height:c});if(!m)this.nav=m=d.g().attr({zIndex:1}).add(this.group),this.up=d.symbol("triangle",0,0,k,k).on("click",function(){b.scroll(-1,j)}).add(m),this.pager=d.text("",15,10).css(i.style).add(m),this.down=d.symbol("triangle-down",0,0,k,k).on("click",
function(){b.scroll(1,j)}).add(m);b.scroll(0);a=f}else if(m)h.attr({height:c.chartHeight}),m.hide(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0;return a},scroll:function(a,b){var c=this.pageCount,d=this.currentPage+a,e=this.clipHeight,f=this.options.navigation,g=f.activeColor,h=f.inactiveColor,f=this.pager,i=this.padding;d>c&&(d=c);if(d>0)b!==w&&$a(b,this.chart),this.nav.attr({translateX:i,translateY:e+7+this.titleHeight,visibility:"visible"}),this.up.attr({fill:d===1?h:g}).css({cursor:d===
1?"default":"pointer"}),f.attr({text:d+"/"+this.pageCount}),this.down.attr({x:18+this.pager.getBBox().width,fill:d===c?h:g}).css({cursor:d===c?"default":"pointer"}),e=-A(e*(d-1),this.fullHeight-e+i)+1,this.scrollGroup.animate({translateY:e}),f.attr({text:d+"/"+c}),this.currentPage=d,this.positionCheckboxes(e)}};Sa.prototype={init:function(a,b){var c,d=a.series;a.series=null;c=z(M,a);c.series=a.series=d;var d=c.chart,e=d.margin,e=da(e)?e:[e,e,e,e];this.optionsMarginTop=p(d.marginTop,e[0]);this.optionsMarginRight=
p(d.marginRight,e[1]);this.optionsMarginBottom=p(d.marginBottom,e[2]);this.optionsMarginLeft=p(d.marginLeft,e[3]);this.runChartClick=(e=d.events)&&!!e.click;this.bounds={h:{},v:{}};this.callback=b;this.isResizing=0;this.options=c;this.axes=[];this.series=[];this.hasCartesianSeries=d.showAxes;var f=this,g;f.index=Ua.length;Ua.push(f);d.reflow!==!1&&F(f,"load",function(){f.initReflow()});if(e)for(g in e)F(f,g,e[g]);f.xAxis=[];f.yAxis=[];f.animation=ia?!1:p(d.animation,!0);f.pointCount=0;f.counters=
new Rb;f.firstRender()},initSeries:function(a){var b=this.options.chart;(b=Q[a.type||b.type||b.defaultSeriesType])||Ba(17,!0);b=new b;b.init(this,a);return b},addSeries:function(a,b,c){var d,e=this;a&&(b=p(b,!0),K(e,"addSeries",{options:a},function(){d=e.initSeries(a);e.isDirtyLegend=!0;b&&e.redraw(c)}));return d},addAxis:function(a,b,c,d){var b=b?"xAxis":"yAxis",e=this.options;new Da(this,z(a,{index:this[b].length}));e[b]=ja(e[b]||{});e[b].push(a);p(c,!0)&&this.redraw(d)},isInsidePlot:function(a,
b,c){var d=c?b:a,a=c?a:b;return d>=0&&d<=this.plotWidth&&a>=0&&a<=this.plotHeight},adjustTickAmounts:function(){this.options.chart.alignTicks!==!1&&n(this.axes,function(a){a.adjustTickAmount()});this.maxTicks=null},redraw:function(a){var b=this.axes,c=this.series,d=this.pointer,e=this.legend,f=this.isDirtyLegend,g,h=this.isDirtyBox,i=c.length,j=i,k=this.renderer,m=k.isHidden(),l=[];$a(a,this);for(m&&this.cloneRenderTo();j--;)if(a=c[j],a.isDirty&&a.options.stacking){g=!0;break}if(g)for(j=i;j--;)if(a=
c[j],a.options.stacking)a.isDirty=!0;n(c,function(a){a.isDirty&&a.options.legendType==="point"&&(f=!0)});if(f&&e.options.enabled)e.render(),this.isDirtyLegend=!1;if(this.hasCartesianSeries){if(!this.isResizing)this.maxTicks=null,n(b,function(a){a.setScale()});this.adjustTickAmounts();this.getMargins();n(b,function(a){if(a.isDirtyExtremes)a.isDirtyExtremes=!1,l.push(function(){K(a,"afterSetExtremes",a.getExtremes())});if(a.isDirty||h||g)a.redraw(),h=!0})}h&&this.drawChartBox();n(c,function(a){a.isDirty&&
a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});d&&d.reset&&d.reset(!0);k.draw();K(this,"redraw");m&&this.cloneRenderTo(!0);n(l,function(a){a.call()})},showLoading:function(a){var b=this.options,c=this.loadingDiv,d=b.loading;if(!c)this.loadingDiv=c=aa(Qa,{className:"highcharts-loading"},y(d.style,{zIndex:10,display:ba}),this.container),this.loadingSpan=aa("span",null,d.labelStyle,c);this.loadingSpan.innerHTML=a||b.lang.loading;if(!this.loadingShown)L(c,{opacity:0,display:"",left:this.plotLeft+
"px",top:this.plotTop+"px",width:this.plotWidth+"px",height:this.plotHeight+"px"}),Mb(c,{opacity:d.style.opacity},{duration:d.showDuration||0}),this.loadingShown=!0},hideLoading:function(){var a=this.options,b=this.loadingDiv;b&&Mb(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){L(b,{display:ba})}});this.loadingShown=!1},get:function(a){var b=this.axes,c=this.series,d,e;for(d=0;d<b.length;d++)if(b[d].options.id===a)return b[d];for(d=0;d<c.length;d++)if(c[d].options.id===a)return c[d];
for(d=0;d<c.length;d++){e=c[d].points||[];for(b=0;b<e.length;b++)if(e[b].id===a)return e[b]}return null},getAxes:function(){var a=this,b=this.options,c=b.xAxis=ja(b.xAxis||{}),b=b.yAxis=ja(b.yAxis||{});n(c,function(a,b){a.index=b;a.isX=!0});n(b,function(a,b){a.index=b});c=c.concat(b);n(c,function(b){new Da(a,b)});a.adjustTickAmounts()},getSelectedPoints:function(){var a=[];n(this.series,function(b){a=a.concat(Eb(b.points||[],function(a){return a.selected}))});return a},getSelectedSeries:function(){return Eb(this.series,
function(a){return a.selected})},showResetZoom:function(){var a=this,b=M.lang,c=a.options.chart.resetZoomButton,d=c.theme,e=d.states,f=c.relativeTo==="chart"?null:"plotBox";this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,e&&e.hover).attr({align:c.position.align,title:b.resetZoomTitle}).add().align(c.position,!1,f)},zoomOut:function(){var a=this;K(a,"selection",{resetSelection:!0},function(){a.zoom()})},zoom:function(a){var b,c=this.pointer,d=!1,e;!a||a.resetSelection?
n(this.axes,function(a){b=a.zoom()}):n(a.xAxis.concat(a.yAxis),function(a){var e=a.axis,h=e.isXAxis;if(c[h?"zoomX":"zoomY"]||c[h?"pinchX":"pinchY"])b=e.zoom(a.min,a.max),e.displayBtn&&(d=!0)});e=this.resetZoomButton;if(d&&!e)this.showResetZoom();else if(!d&&da(e))this.resetZoomButton=e.destroy();b&&this.redraw(p(this.options.chart.animation,a&&a.animation,this.pointCount<100))},pan:function(a){var b=this.xAxis[0],c=this.mouseDownX,d=b.pointRange/2,e=b.getExtremes(),f=b.translate(c-a,!0)+d,c=b.translate(c+
this.plotWidth-a,!0)-d;(d=this.hoverPoints)&&n(d,function(a){a.setState()});b.series.length&&f>A(e.dataMin,e.min)&&c<t(e.dataMax,e.max)&&b.setExtremes(f,c,!0,!1,{trigger:"pan"});this.mouseDownX=a;L(this.container,{cursor:"move"})},setTitle:function(a,b){var f;var c=this,d=c.options,e;e=d.title=z(d.title,a);f=d.subtitle=z(d.subtitle,b),d=f;n([["title",a,e],["subtitle",b,d]],function(a){var b=a[0],d=c[b],e=a[1],a=a[2];d&&e&&(c[b]=d=d.destroy());a&&a.text&&!d&&(c[b]=c.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,
"class":"highcharts-"+b,zIndex:a.zIndex||4}).css(a.style).add().align(a,!1,"spacingBox"))})},getChartSize:function(){var a=this.options.chart,b=this.renderToClone||this.renderTo;this.containerWidth=vb(b,"width");this.containerHeight=vb(b,"height");this.chartWidth=t(0,a.width||this.containerWidth||600);this.chartHeight=t(0,p(a.height,this.containerHeight>19?this.containerHeight:400))},cloneRenderTo:function(a){var b=this.renderToClone,c=this.container;a?b&&(this.renderTo.appendChild(c),Za(b),delete this.renderToClone):
(c&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),L(b,{position:"absolute",top:"-9999px",display:"block"}),H.body.appendChild(b),c&&b.appendChild(c))},getContainer:function(){var a,b=this.options.chart,c,d,e;this.renderTo=a=b.renderTo;e="highcharts-"+Kb++;if(ma(a))this.renderTo=a=H.getElementById(a);a||Ba(13,!0);c=C(G(a,"data-highcharts-chart"));!isNaN(c)&&Ua[c]&&Ua[c].destroy();G(a,"data-highcharts-chart",this.index);a.innerHTML="";a.offsetWidth||this.cloneRenderTo();
this.getChartSize();c=this.chartWidth;d=this.chartHeight;this.container=a=aa(Qa,{className:"highcharts-container"+(b.className?" "+b.className:""),id:e},y({position:"relative",overflow:"hidden",width:c+"px",height:d+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},b.style),this.renderToClone||a);this._cursor=a.style.cursor;this.renderer=b.forExport?new Ga(a,c,d,!0):new cb(a,c,d);ia&&this.renderer.create(this,a,c,d)},getMargins:function(){var a=this.options.chart,
b=a.spacingTop,c=a.spacingRight,d=a.spacingBottom,a=a.spacingLeft,e,f=this.legend,g=this.optionsMarginTop,h=this.optionsMarginLeft,i=this.optionsMarginRight,j=this.optionsMarginBottom,k=this.options.title,m=this.options.subtitle,l=this.options.legend,o=p(l.margin,10),q=l.x,O=l.y,u=l.align,s=l.verticalAlign;this.resetMargins();e=this.axisOffset;if((this.title||this.subtitle)&&!v(this.optionsMarginTop))if(m=t(this.title&&!k.floating&&!k.verticalAlign&&k.y||0,this.subtitle&&!m.floating&&!m.verticalAlign&&
m.y||0))this.plotTop=t(this.plotTop,m+p(k.margin,15)+b);if(f.display&&!l.floating)if(u==="right"){if(!v(i))this.marginRight=t(this.marginRight,f.legendWidth-q+o+c)}else if(u==="left"){if(!v(h))this.plotLeft=t(this.plotLeft,f.legendWidth+q+o+a)}else if(s==="top"){if(!v(g))this.plotTop=t(this.plotTop,f.legendHeight+O+o+b)}else if(s==="bottom"&&!v(j))this.marginBottom=t(this.marginBottom,f.legendHeight-O+o+d);this.extraBottomMargin&&(this.marginBottom+=this.extraBottomMargin);this.extraTopMargin&&(this.plotTop+=
this.extraTopMargin);this.hasCartesianSeries&&n(this.axes,function(a){a.getOffset()});v(h)||(this.plotLeft+=e[3]);v(g)||(this.plotTop+=e[0]);v(j)||(this.marginBottom+=e[2]);v(i)||(this.marginRight+=e[1]);this.setChartSize()},initReflow:function(){function a(a){var g=c.width||vb(d,"width"),h=c.height||vb(d,"height"),a=a?a.target:Y;if(!b.hasUserSize&&g&&h&&(a===Y||a===H)){if(g!==b.containerWidth||h!==b.containerHeight)clearTimeout(e),b.reflowTimeout=e=setTimeout(function(){if(b.container)b.setSize(g,
h,!1),b.hasUserSize=null},100);b.containerWidth=g;b.containerHeight=h}}var b=this,c=b.options.chart,d=b.renderTo,e;F(Y,"resize",a);F(b,"destroy",function(){X(Y,"resize",a)})},setSize:function(a,b,c){var d=this,e,f,g;d.isResizing+=1;g=function(){d&&K(d,"endResize",null,function(){d.isResizing-=1})};$a(c,d);d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;if(v(a))d.chartWidth=e=t(0,r(a)),d.hasUserSize=!!e;if(v(b))d.chartHeight=f=t(0,r(b));L(d.container,{width:e+"px",height:f+"px"});d.setChartSize(!0);
d.renderer.setSize(e,f,c);d.maxTicks=null;n(d.axes,function(a){a.isDirty=!0;a.setScale()});n(d.series,function(a){a.isDirty=!0});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.getMargins();d.redraw(c);d.oldChartHeight=null;K(d,"resize");Ra===!1?g():setTimeout(g,Ra&&Ra.duration||500)},setChartSize:function(a){var b=this.inverted,c=this.renderer,d=this.chartWidth,e=this.chartHeight,f=this.options.chart,g=f.spacingTop,h=f.spacingRight,i=f.spacingBottom,j=f.spacingLeft,k=this.clipOffset,m,l,o,q;this.plotLeft=m=
r(this.plotLeft);this.plotTop=l=r(this.plotTop);this.plotWidth=o=t(0,r(d-m-this.marginRight));this.plotHeight=q=t(0,r(e-l-this.marginBottom));this.plotSizeX=b?q:o;this.plotSizeY=b?o:q;this.plotBorderWidth=b=f.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:j,y:g,width:d-j-h,height:e-g-i};this.plotBox=c.plotBox={x:m,y:l,width:o,height:q};c=pa(t(b,k[3])/2);d=pa(t(b,k[0])/2);this.clipBox={x:c,y:d,width:W(this.plotSizeX-t(b,k[1])/2-c),height:W(this.plotSizeY-t(b,k[2])/2-d)};a||n(this.axes,function(a){a.setAxisSize();
a.setAxisTranslation()})},resetMargins:function(){var a=this.options.chart,b=a.spacingRight,c=a.spacingBottom,d=a.spacingLeft;this.plotTop=p(this.optionsMarginTop,a.spacingTop);this.marginRight=p(this.optionsMarginRight,b);this.marginBottom=p(this.optionsMarginBottom,c);this.plotLeft=p(this.optionsMarginLeft,d);this.axisOffset=[0,0,0,0];this.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=this.chartWidth,d=this.chartHeight,e=this.chartBackground,f=this.plotBackground,
g=this.plotBorder,h=this.plotBGImage,i=a.borderWidth||0,j=a.backgroundColor,k=a.plotBackgroundColor,m=a.plotBackgroundImage,l=a.plotBorderWidth||0,o,q=this.plotLeft,n=this.plotTop,p=this.plotWidth,s=this.plotHeight,x=this.plotBox,r=this.clipRect,t=this.clipBox;o=i+(a.shadow?8:0);if(i||j)if(e)e.animate(e.crisp(null,null,null,c-o,d-o));else{e={fill:j||ba};if(i)e.stroke=a.borderColor,e["stroke-width"]=i;this.chartBackground=b.rect(o/2,o/2,c-o,d-o,a.borderRadius,i).attr(e).add().shadow(a.shadow)}if(k)f?
f.animate(x):this.plotBackground=b.rect(q,n,p,s,0).attr({fill:k}).add().shadow(a.plotShadow);if(m)h?h.animate(x):this.plotBGImage=b.image(m,q,n,p,s).add();r?r.animate({width:t.width,height:t.height}):this.clipRect=b.clipRect(t);if(l)g?g.animate(g.crisp(null,q,n,p,s)):this.plotBorder=b.rect(q,n,p,s,0,l).attr({stroke:a.plotBorderColor,"stroke-width":l,zIndex:1}).add();this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,d=a.options.series,e,f;n(["inverted","angular","polar"],
function(g){c=Q[b.type||b.defaultSeriesType];f=a[g]||b[g]||c&&c.prototype[g];for(e=d&&d.length;!f&&e--;)(c=Q[d[e].type])&&c.prototype[g]&&(f=!0);a[g]=f})},render:function(){var a=this,b=a.axes,c=a.renderer,d=a.options,e=d.labels,f=d.credits,g;a.setTitle();a.legend=new Hb(a,d.legend);n(b,function(a){a.setScale()});a.getMargins();a.maxTicks=null;n(b,function(a){a.setTickPositions(!0);a.setMaxTicks()});a.adjustTickAmounts();a.getMargins();a.drawChartBox();a.hasCartesianSeries&&n(b,function(a){a.render()});
if(!a.seriesGroup)a.seriesGroup=c.g("series-group").attr({zIndex:3}).add();n(a.series,function(a){a.translate();a.setTooltipPoints();a.render()});e.items&&n(e.items,function(b){var d=y(e.style,b.style),f=C(d.left)+a.plotLeft,g=C(d.top)+a.plotTop+12;delete d.left;delete d.top;c.text(b.html,f,g).attr({zIndex:2}).css(d).add()});if(f.enabled&&!a.credits)g=f.href,a.credits=c.text(f.text,0,0).on("click",function(){if(g)location.href=g}).attr({align:f.position.align,zIndex:8}).css(f.style).add().align(f.position);
a.hasRendered=!0},destroy:function(){var a=this,b=a.axes,c=a.series,d=a.container,e,f=d&&d.parentNode;K(a,"destroy");Ua[a.index]=w;a.renderTo.removeAttribute("data-highcharts-chart");X(a);for(e=b.length;e--;)b[e]=b[e].destroy();for(e=c.length;e--;)c[e]=c[e].destroy();n("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","),function(b){var c=a[b];c&&c.destroy&&(a[b]=c.destroy())});
if(d)d.innerHTML="",X(d),f&&Za(d);for(e in a)delete a[e]},isReadyToRender:function(){var a=this;return!ca&&Y==Y.top&&H.readyState!=="complete"||ia&&!Y.canvg?(ia?$b.push(function(){a.firstRender()},a.options.global.canvasToolsURL):H.attachEvent("onreadystatechange",function(){H.detachEvent("onreadystatechange",a.firstRender);H.readyState==="complete"&&a.firstRender()}),!1):!0},firstRender:function(){var a=this,b=a.options,c=a.callback;if(a.isReadyToRender())a.getContainer(),K(a,"init"),a.resetMargins(),
a.setChartSize(),a.propFromSeries(),a.getAxes(),n(b.series||[],function(b){a.initSeries(b)}),K(a,"beforeRender"),a.pointer=new pb(a,b),a.render(),a.renderer.draw(),c&&c.apply(a,[a]),n(a.callbacks,function(b){b.apply(a,[a])}),a.cloneRenderTo(!0),K(a,"load")}};Sa.prototype.callbacks=[];var Ha=function(){};Ha.prototype={init:function(a,b,c){this.series=a;this.applyOptions(b,c);this.pointAttr={};if(a.options.colorByPoint&&(b=a.options.colors||a.chart.options.colors,this.color=this.color||b[a.colorCounter++],
a.colorCounter===b.length))a.colorCounter=0;a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=c.pointValKey,a=Ha.prototype.optionsToObject.call(this,a);y(this,a);this.options=this.options?y(this.options,a):a;if(d)this.y=this[d];if(this.x===w&&c)this.x=b===w?c.autoIncrement():b;return this},optionsToObject:function(a){var b,c=this.series,d=c.pointArrayMap||["y"],e=d.length,f=0,g=0;if(typeof a==="number"||a===null)b={y:a};else if(Wa(a)){b={};if(a.length>e){c=typeof a[0];
if(c==="string")b.name=a[0];else if(c==="number")b.x=a[0];f++}for(;g<e;)b[d[g++]]=a[f++]}else if(typeof a==="object"){b=a;if(a.dataLabels)c._hasPointLabels=!0;if(a.marker)c._hasPointMarkers=!0}return b},destroy:function(){var a=this.series.chart,b=a.hoverPoints,c;a.pointCount--;if(b&&(this.setState(),na(b,this),!b.length))a.hoverPoints=null;if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel)X(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(c in this)this[c]=
null},destroyElements:function(){for(var a="graphic,dataLabel,dataLabelUpper,group,connector,shadowGroup".split(","),b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}},select:function(a,b){var c=this,d=c.series,e=d.chart,a=p(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=
c.options.selected=a;d.options.data[va(c,d.data)]=c.options;c.setState(a&&"select");b||n(e.getSelectedPoints(),function(a){if(a.selected&&a!==c)a.selected=a.options.selected=!1,d.options.data[va(a,d.data)]=a.options,a.setState(""),a.firePointEvent("unselect")})})},onMouseOver:function(a){var b=this.series,c=b.chart,d=c.tooltip,e=c.hoverPoint;if(e&&e!==this)e.onMouseOut();this.firePointEvent("mouseOver");d&&(!d.shared||b.noSharedTooltip)&&d.refresh(this,a);this.setState("hover");c.hoverPoint=this},
onMouseOut:function(){var a=this.series.chart,b=a.hoverPoints;if(!b||va(this,b)===-1)this.firePointEvent("mouseOut"),this.setState(),a.hoverPoint=null},tooltipFormatter:function(a){var b=this.series,c=b.tooltipOptions,d=p(c.valueDecimals,""),e=c.valuePrefix||"",f=c.valueSuffix||"";n(b.pointArrayMap||["y"],function(b){b="{point."+b;if(e||f)a=a.replace(b+"}",e+b+"}"+f);a=a.replace(b+"}",b+":,."+d+"f}")});return La(a,{point:this,series:this.series})},update:function(a,b,c){var d=this,e=d.series,f=d.graphic,
g,h=e.data,i=e.chart,b=p(b,!0);d.firePointEvent("update",{options:a},function(){d.applyOptions(a);da(a)&&(e.getAttribs(),f&&f.attr(d.pointAttr[e.state]));g=va(d,h);e.xData[g]=d.x;e.yData[g]=e.toYData?e.toYData(d):d.y;e.zData[g]=d.z;e.options.data[g]=d.options;e.isDirty=!0;e.isDirtyData=!0;b&&i.redraw(c)})},remove:function(a,b){var c=this,d=c.series,e=d.chart,f,g=d.data;$a(b,e);a=p(a,!0);c.firePointEvent("remove",null,function(){f=va(c,g);g.splice(f,1);d.options.data.splice(f,1);d.xData.splice(f,1);
d.yData.splice(f,1);d.zData.splice(f,1);c.destroy();d.isDirty=!0;d.isDirtyData=!0;a&&e.redraw()})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&this.importEvents();a==="click"&&e.allowPointSelect&&(c=function(a){d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});K(this,a,b,c)},importEvents:function(){if(!this.hasImportedEvents){var a=z(this.series.options.point,this.options).events,b;this.events=a;for(b in a)F(this,
b,a[b]);this.hasImportedEvents=!0}},setState:function(a){var b=this.plotX,c=this.plotY,d=this.series,e=d.options.states,f=S[d.type].marker&&d.options.marker,g=f&&!f.enabled,h=f&&f.states[a],i=h&&h.enabled===!1,j=d.stateMarkerGraphic,k=this.marker||{},m=d.chart,l=this.pointAttr,a=a||"";if(!(a===this.state||this.selected&&a!=="select"||e[a]&&e[a].enabled===!1||a&&(i||g&&!h.enabled))){if(this.graphic)e=f&&this.graphic.symbolName&&l[a].r,this.graphic.attr(z(l[a],e?{x:b-e,y:c-e,width:2*e,height:2*e}:{}));
else{if(a&&h)e=h.radius,k=k.symbol||d.symbol,j&&j.currentSymbol!==k&&(j=j.destroy()),j?j.attr({x:b-e,y:c-e}):(d.stateMarkerGraphic=j=m.renderer.symbol(k,b-e,c-e,2*e,2*e).attr(l[a]).add(d.markerGroup),j.currentSymbol=k);if(j)j[a&&m.isInsidePlot(b,c)?"show":"hide"]()}this.state=a}}};var $=function(){};$.prototype={isCartesian:!0,type:"line",pointClass:Ha,sorted:!0,requireSorting:!0,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},colorCounter:0,init:function(a,
b){var c,d,e=a.series;this.chart=a;this.options=b=this.setOptions(b);this.bindAxes();y(this,{name:b.name,state:"",pointAttr:{},visible:b.visible!==!1,selected:b.selected===!0});if(ia)b.animation=!1;d=b.events;for(c in d)F(this,c,d[c]);if(d&&d.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;this.getColor();this.getSymbol();this.setData(b.data,!1);if(this.isCartesian)a.hasCartesianSeries=!0;e.push(this);this._i=e.length-1;Sb(e,function(a,b){return p(a.options.index,
a._i)-p(b.options.index,a._i)});n(e,function(a,b){a.index=b;a.name=a.name||"Series "+(b+1)});c=b.linkedTo;this.linkedSeries=[];if(ma(c)&&(c=c===":previous"?e[this.index-1]:a.get(c)))c.linkedSeries.push(this),this.linkedParent=c},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;a.isCartesian&&n(["xAxis","yAxis"],function(e){n(c[e],function(c){d=c.options;if(b[e]===d.index||b[e]!==w&&b[e]===d.id||b[e]===w&&d.index===0)c.series.push(a),a[e]=c,c.isDirty=!0});a[e]||Ba(18,!0)})},autoIncrement:function(){var a=
this.options,b=this.xIncrement,b=p(b,a.pointStart,0);this.pointInterval=p(this.pointInterval,a.pointInterval,1);this.xIncrement=b+this.pointInterval;return b},getSegments:function(){var a=-1,b=[],c,d=this.points,e=d.length;if(e)if(this.options.connectNulls){for(c=e;c--;)d[c].y===null&&d.splice(c,1);d.length&&(b=[d])}else n(d,function(c,g){c.y===null?(g>a+1&&b.push(d.slice(a+1,g)),a=g):g===e-1&&b.push(d.slice(a+1,g+1))});this.segments=b},setOptions:function(a){var b=this.chart.options,c=b.plotOptions,
d=c[this.type];this.userOptions=a;a=z(d,c.series,a);this.tooltipOptions=z(b.tooltip,a.tooltip);d.marker===null&&delete a.marker;return a},getColor:function(){var a=this.options,b=this.userOptions,c=this.chart.options.colors,d=this.chart.counters,e;e=a.color||S[this.type].color;if(!e&&!a.colorByPoint)v(b._colorIndex)?a=b._colorIndex:(b._colorIndex=d.color,a=d.color++),e=c[a];this.color=e;d.wrapColor(c.length)},getSymbol:function(){var a=this.userOptions,b=this.options.marker,c=this.chart,d=c.options.symbols,
c=c.counters;this.symbol=b.symbol;if(!this.symbol)v(a._symbolIndex)?a=a._symbolIndex:(a._symbolIndex=c.symbol,a=c.symbol++),this.symbol=d[a];if(/^url/.test(this.symbol))b.radius=0;c.wrapSymbol(d.length)},drawLegendSymbol:function(a){var b=this.options,c=b.marker,d=a.options.symbolWidth,e=this.chart.renderer,f=this.legendGroup,a=a.baseline,g;if(b.lineWidth){g={"stroke-width":b.lineWidth};if(b.dashStyle)g.dashstyle=b.dashStyle;this.legendLine=e.path(["M",0,a-4,"L",d,a-4]).attr(g).add(f)}if(c&&c.enabled)b=
c.radius,this.legendSymbol=e.symbol(this.symbol,d/2-b,a-4-b,2*b,2*b).add(f)},addPoint:function(a,b,c,d){var e=this.options,f=this.data,g=this.graph,h=this.area,i=this.chart,j=this.xData,k=this.yData,m=this.zData,l=this.names,o=g&&g.shift||0,q=e.data;$a(d,i);if(g&&c)g.shift=o+1;if(h){if(c)h.shift=o+1;h.isArea=!0}b=p(b,!0);d={series:this};this.pointClass.prototype.applyOptions.apply(d,[a]);j.push(d.x);k.push(this.toYData?this.toYData(d):d.y);m.push(d.z);if(l)l[d.x]=d.name;q.push(a);e.legendType==="point"&&
this.generatePoints();c&&(f[0]&&f[0].remove?f[0].remove(!1):(f.shift(),j.shift(),k.shift(),m.shift(),q.shift()));this.getAttribs();this.isDirtyData=this.isDirty=!0;b&&i.redraw()},setData:function(a,b){var c=this.points,d=this.options,e=this.chart,f=null,g=this.xAxis,h=g&&g.categories&&!g.categories.length?[]:null,i;this.xIncrement=null;this.pointRange=g&&g.categories?1:d.pointRange;this.colorCounter=0;var j=[],k=[],m=[],l=a?a.length:[],o=(i=this.pointArrayMap)&&i.length,q=!!this.toYData;if(l>(d.turboThreshold||
1E3)){for(i=0;f===null&&i<l;)f=a[i],i++;if(Ja(f)){f=p(d.pointStart,0);d=p(d.pointInterval,1);for(i=0;i<l;i++)j[i]=f,k[i]=a[i],f+=d;this.xIncrement=f}else if(Wa(f))if(o)for(i=0;i<l;i++)d=a[i],j[i]=d[0],k[i]=d.slice(1,o+1);else for(i=0;i<l;i++)d=a[i],j[i]=d[0],k[i]=d[1]}else for(i=0;i<l;i++)if(a[i]!==w&&(d={series:this},this.pointClass.prototype.applyOptions.apply(d,[a[i]]),j[i]=d.x,k[i]=q?this.toYData(d):d.y,m[i]=d.z,h&&d.name))h[i]=d.name;this.requireSorting&&j.length>1&&j[1]<j[0]&&Ba(15);ma(k[0])&&
Ba(14,!0);this.data=[];this.options.data=a;this.xData=j;this.yData=k;this.zData=m;this.names=h;for(i=c&&c.length||0;i--;)c[i]&&c[i].destroy&&c[i].destroy();if(g)g.minRange=g.userMinRange;this.isDirty=this.isDirtyData=e.isDirtyBox=!0;p(b,!0)&&e.redraw(!1)},remove:function(a,b){var c=this,d=c.chart,a=p(a,!0);if(!c.isRemoving)c.isRemoving=!0,K(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=!0;a&&d.redraw(b)});c.isRemoving=!1},processData:function(a){var b=this.xData,c=this.yData,
d=b.length,e=0,f=d,g,h,i=this.xAxis,j=this.options,k=j.cropThreshold,m=this.isCartesian;if(m&&!this.isDirty&&!i.isDirty&&!this.yAxis.isDirty&&!a)return!1;if(m&&this.sorted&&(!k||d>k||this.forceCrop))if(a=i.getExtremes(),i=a.min,k=a.max,b[d-1]<i||b[0]>k)b=[],c=[];else if(b[0]<i||b[d-1]>k){for(a=0;a<d;a++)if(b[a]>=i){e=t(0,a-1);break}for(;a<d;a++)if(b[a]>k){f=a+1;break}b=b.slice(e,f);c=c.slice(e,f);g=!0}for(a=b.length-1;a>0;a--)if(d=b[a]-b[a-1],d>0&&(h===w||d<h))h=d;this.cropped=g;this.cropStart=e;
this.processedXData=b;this.processedYData=c;if(j.pointRange===null)this.pointRange=h||1;this.closestPointRange=h},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,f=this.pointClass,g=d.length,h=this.cropStart||0,i,j=this.hasGroupedData,k,m=[],l;if(!b&&!j)b=[],b.length=a.length,b=this.data=b;for(l=0;l<g;l++)i=h+l,j?m[l]=(new f).init(this,[d[l]].concat(ja(e[l]))):(b[i]?k=b[i]:a[i]!==w&&(b[i]=k=(new f).init(this,a[i],d[l])),m[l]=k);if(b&&(g!==
(c=b.length)||j))for(l=0;l<c;l++)if(l===h&&!j&&(l+=g),b[l])b[l].destroyElements(),b[l].plotX=w;this.data=b;this.points=m},translate:function(){this.processedXData||this.processData();this.generatePoints();var a=this.options,b=a.stacking,c=this.xAxis,d=c.categories,e=this.yAxis,f=this.points,g=f.length,h=!!this.modifyValue,i,j,k=a.pointPlacement==="between",m=a.threshold;j=e.series.sort(function(a,b){return a.index-b.index});for(a=j.length;a--;)if(j[a].visible){j[a]===this&&(i=!0);break}for(a=0;a<
g;a++){j=f[a];var l=j.x,o=j.y,q=j.low,n=e.stacks[(o<m?"-":"")+this.stackKey];if(e.isLog&&o<=0)j.y=o=null;j.plotX=c.translate(l,0,0,0,1,k);if(b&&this.visible&&n&&n[l])q=n[l],n=q.total,q.cum=q=q.cum-o,o=q+o,i&&(q=p(m,e.min)),e.isLog&&q<=0&&(q=null),b==="percent"&&(q=n?q*100/n:0,o=n?o*100/n:0),j.percentage=n?j.y*100/n:0,j.total=j.stackTotal=n,j.stackY=o;j.yBottom=v(q)?e.translate(q,0,1,0,1):null;h&&(o=this.modifyValue(o,j));j.plotY=typeof o==="number"&&o!==Infinity?r(e.translate(o,0,1,0,1)*10)/10:w;
j.clientX=k?c.translate(l,0,0,0,1):j.plotX;j.negative=j.y<(m||0);j.category=d&&d[j.x]!==w?d[j.x]:j.x}this.getSegments()},setTooltipPoints:function(a){var b=[],c,d,e=(c=this.xAxis)?c.tooltipLen||c.len:this.chart.plotSizeX,f,g,h=[];if(this.options.enableMouseTracking!==!1){if(a)this.tooltipPoints=null;n(this.segments||this.points,function(a){b=b.concat(a)});c&&c.reversed&&(b=b.reverse());a=b.length;for(g=0;g<a;g++){f=b[g];c=b[g-1]?d+1:0;for(d=b[g+1]?t(0,W((f.clientX+(b[g+1]?b[g+1].clientX:e))/2)):e;c>=
0&&c<=d;)h[c++]=f}this.tooltipPoints=h}},tooltipHeaderFormatter:function(a){var b=this.tooltipOptions,c=b.xDateFormat,d=b.dateTimeLabelFormats,e=this.xAxis,f=e&&e.options.type==="datetime",b=b.headerFormat,e=e&&e.closestPointRange,g;if(f&&!c)if(e)for(g in I){if(I[g]>=e){c=d[g];break}}else c=d.day;f&&c&&Ja(a.key)&&(b=b.replace("{point.key}","{point.key:"+c+"}"));return La(b,{point:a,series:this})},onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&
K(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;if(d)d.onMouseOut();this&&a.events.mouseOut&&K(this,"mouseOut");c&&!a.stickyTracking&&(!c.shared||this.noSharedTooltip)&&c.hide();this.setState();b.hoverSeries=null},animate:function(a){var b=this,c=b.chart,d=c.renderer,e;e=b.options.animation;var f=c.clipBox,g=c.inverted,h;if(e&&!da(e))e=S[b.type].animation;h="_sharedClip"+e.duration+e.easing;if(a)a=c[h],
e=c[h+"m"],a||(c[h]=a=d.clipRect(y(f,{width:0})),c[h+"m"]=e=d.clipRect(-99,g?-c.plotLeft:-c.plotTop,99,g?c.chartWidth:c.chartHeight)),b.group.clip(a),b.markerGroup.clip(e),b.sharedClipKey=h;else{if(a=c[h])a.animate({width:c.plotSizeX},e),c[h+"m"].animate({width:c.plotSizeX+99},e);b.animate=null;b.animationTimeout=setTimeout(function(){b.afterAnimate()},e.duration)}},afterAnimate:function(){var a=this.chart,b=this.sharedClipKey,c=this.group;c&&this.options.clip!==!1&&(c.clip(a.clipRect),this.markerGroup.clip());
setTimeout(function(){b&&a[b]&&(a[b]=a[b].destroy(),a[b+"m"]=a[b+"m"].destroy())},100)},drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,i,j,k,m=this.options.marker,l,o=this.markerGroup;if(m.enabled||this._hasPointMarkers)for(f=b.length;f--;)if(g=b[f],d=g.plotX,e=g.plotY,k=g.graphic,i=g.marker||{},a=m.enabled&&i.enabled===w||i.enabled,l=c.isInsidePlot(r(d),e,c.inverted),a&&e!==w&&!isNaN(e)&&g.y!==null)if(a=g.pointAttr[g.selected?"select":""],h=a.r,i=p(i.symbol,this.symbol),j=i.indexOf("url")===
0,k)k.attr({visibility:l?ca?"inherit":"visible":"hidden"}).animate(y({x:d-h,y:e-h},k.symbolName?{width:2*h,height:2*h}:{}));else{if(l&&(h>0||j))g.graphic=c.renderer.symbol(i,d-h,e-h,2*h,2*h).attr(a).add(o)}else if(k)g.graphic=k.destroy()},convertAttribs:function(a,b,c,d){var e=this.pointAttrToOptions,f,g,h={},a=a||{},b=b||{},c=c||{},d=d||{};for(f in e)g=e[f],h[f]=p(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=a.options,c=S[a.type].marker?b.marker:b,d=c.states,e=d.hover,f,g=a.color,
h={stroke:g,fill:g},i=a.points||[],j=[],k,m=a.pointAttrToOptions,l=b.negativeColor,o;b.marker?(e.radius=e.radius||c.radius+2,e.lineWidth=e.lineWidth||c.lineWidth+1):e.color=e.color||wa(e.color||g).brighten(e.brightness).get();j[""]=a.convertAttribs(c,h);n(["hover","select"],function(b){j[b]=a.convertAttribs(d[b],j[""])});a.pointAttr=j;for(g=i.length;g--;){h=i[g];if((c=h.options&&h.options.marker||h.options)&&c.enabled===!1)c.radius=0;if(h.negative&&l)h.color=h.fillColor=l;f=b.colorByPoint||h.color;
if(h.options)for(o in m)v(c[m[o]])&&(f=!0);if(f){c=c||{};k=[];d=c.states||{};f=d.hover=d.hover||{};if(!b.marker)f.color=wa(f.color||h.color).brighten(f.brightness||e.brightness).get();k[""]=a.convertAttribs(y({color:h.color},c),j[""]);k.hover=a.convertAttribs(d.hover,j.hover,k[""]);k.select=a.convertAttribs(d.select,j.select,k[""]);if(h.negative&&b.marker&&l)k[""].fill=k.hover.fill=k.select.fill=a.convertAttribs({fillColor:l}).fill}else k=j;h.pointAttr=k}},update:function(a,b){var c=this.chart,d=
this.type,a=z(this.userOptions,{animation:!1,index:this.index,pointStart:this.xData[0]},a);this.remove(!1);y(this,Q[a.type||d].prototype);this.init(c,a);p(b,!0)&&c.redraw(!1)},destroy:function(){var a=this,b=a.chart,c=/AppleWebKit\/533/.test(Ta),d,e,f=a.data||[],g,h,i;K(a,"destroy");X(a);n(["xAxis","yAxis"],function(b){if(i=a[b])na(i.series,a),i.isDirty=i.forceRedraw=!0});a.legendItem&&a.chart.legend.destroyItem(a);for(e=f.length;e--;)(g=f[e])&&g.destroy&&g.destroy();a.points=null;clearTimeout(a.animationTimeout);
n("area,graph,dataLabelsGroup,group,markerGroup,tracker,graphNeg,areaNeg,posClip,negClip".split(","),function(b){a[b]&&(d=c&&b==="group"?"hide":"destroy",a[b][d]())});if(b.hoverSeries===a)b.hoverSeries=null;na(b.series,a);for(h in a)delete a[h]},drawDataLabels:function(){var a=this,b=a.options.dataLabels,c=a.points,d,e,f,g;if(b.enabled||a._hasPointLabels)a.dlProcessOptions&&a.dlProcessOptions(b),g=a.plotGroup("dataLabelsGroup","data-labels",a.visible?"visible":"hidden",b.zIndex||6),e=b,n(c,function(c){var i,
j=c.dataLabel,k,m,l=c.connector,o=!0;d=c.options&&c.options.dataLabels;i=e.enabled||d&&d.enabled;if(j&&!i)c.dataLabel=j.destroy();else if(i){i=b.rotation;b=z(e,d);k=c.getLabelConfig();f=b.format?La(b.format,k):b.formatter.call(k,b);b.style.color=p(b.color,b.style.color,a.color,"black");if(j)if(v(f))j.attr({text:f}),o=!1;else{if(c.dataLabel=j=j.destroy(),l)c.connector=l.destroy()}else if(v(f)){j={fill:b.backgroundColor,stroke:b.borderColor,"stroke-width":b.borderWidth,r:b.borderRadius||0,rotation:i,
padding:b.padding,zIndex:1};for(m in j)j[m]===w&&delete j[m];j=c.dataLabel=a.chart.renderer[i?"text":"label"](f,0,-999,null,null,null,b.useHTML).attr(j).css(b.style).add(g).shadow(b.shadow)}j&&a.alignDataLabel(c,j,b,null,o)}})},alignDataLabel:function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=p(a.plotX,-999),a=p(a.plotY,-999),i=b.getBBox(),d=y({x:g?f.plotWidth-a:h,y:r(g?f.plotHeight-h:a),width:0,height:0},d);y(c,{width:i.width,height:i.height});c.rotation?(d={align:c.align,x:d.x+c.x+d.width/2,y:d.y+
c.y+d.height/2},b[e?"attr":"animate"](d)):b.align(c,null,d);b.attr({visibility:c.crop===!1||f.isInsidePlot(h,a,g)?f.renderer.isSVG?"inherit":"visible":"hidden"})},getSegmentPath:function(a){var b=this,c=[],d=b.options.step;n(a,function(e,f){var g=e.plotX,h=e.plotY,i;b.getPointSpline?c.push.apply(c,b.getPointSpline(a,e,f)):(c.push(f?"L":"M"),d&&f&&(i=a[f-1],d==="right"?c.push(i.plotX,h):d==="center"?c.push((i.plotX+g)/2,i.plotY,(i.plotX+g)/2,h):c.push(g,i.plotY)),c.push(e.plotX,e.plotY))});return c},
getGraphPath:function(){var a=this,b=[],c,d=[];n(a.segments,function(e){c=a.getSegmentPath(e);e.length>1?b=b.concat(c):d.push(e[0])});a.singlePoints=d;return a.graphPath=b},drawGraph:function(){var a=this,b=this.options,c=[["graph",b.lineColor||this.color]],d=b.lineWidth,e=b.dashStyle,f=this.getGraphPath(),g=b.negativeColor;g&&c.push(["graphNeg",g]);n(c,function(c,g){var j=c[0],k=a[j];if(k)hb(k),k.animate({d:f});else if(d&&f.length){k={stroke:c[1],"stroke-width":d,zIndex:1};if(e)k.dashstyle=e;a[j]=
a.chart.renderer.path(f).attr(k).add(a.group).shadow(!g&&b.shadow)}})},clipNeg:function(){var a=this.options,b=this.chart,c=b.renderer,d=a.negativeColor,e,f=this.graph,g=this.area,h=this.posClip,i=this.negClip;e=b.chartWidth;var j=b.chartHeight,k=t(e,j);if(d&&(f||g))d=pa(this.yAxis.len-this.yAxis.translate(a.threshold||0)),a={x:0,y:0,width:k,height:d},k={x:0,y:d,width:k,height:k-d},b.inverted&&c.isVML&&(a={x:b.plotWidth-d-b.plotLeft,y:0,width:e,height:j},k={x:d+b.plotLeft-e,y:0,width:b.plotLeft+d,
height:e}),this.yAxis.reversed?(b=k,e=a):(b=a,e=k),h?(h.animate(b),i.animate(e)):(this.posClip=h=c.clipRect(b),this.negClip=i=c.clipRect(e),f&&(f.clip(h),this.graphNeg.clip(i)),g&&(g.clip(h),this.areaNeg.clip(i)))},invertGroups:function(){function a(){var a={width:b.yAxis.len,height:b.xAxis.len};n(["group","markerGroup"],function(c){b[c]&&b[c].attr(a).invert()})}var b=this,c=b.chart;if(b.xAxis)F(c,"resize",a),F(b,"destroy",function(){X(c,"resize",a)}),a(),b.invertGroups=a},plotGroup:function(a,b,
c,d,e){var f=this[a],g=!f,h=this.chart,i=this.xAxis,j=this.yAxis;g&&(this[a]=f=h.renderer.g(b).attr({visibility:c,zIndex:d||0.1}).add(e));f[g?"attr":"animate"]({translateX:i?i.left:h.plotLeft,translateY:j?j.top:h.plotTop,scaleX:1,scaleY:1});return f},render:function(){var a=this.chart,b,c=this.options,d=c.animation&&!!this.animate&&a.renderer.isSVG,e=this.visible?"visible":"hidden",f=c.zIndex,g=this.hasRendered,h=a.seriesGroup;b=this.plotGroup("group","series",e,f,h);this.markerGroup=this.plotGroup("markerGroup",
"markers",e,f,h);d&&this.animate(!0);this.getAttribs();b.inverted=this.isCartesian?a.inverted:!1;this.drawGraph&&(this.drawGraph(),this.clipNeg());this.drawDataLabels();this.drawPoints();this.options.enableMouseTracking!==!1&&this.drawTracker();a.inverted&&this.invertGroups();c.clip!==!1&&!this.sharedClipKey&&!g&&b.clip(a.clipRect);d?this.animate():g||this.afterAnimate();this.isDirty=this.isDirtyData=!1;this.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirtyData,c=this.group,d=this.xAxis,
e=this.yAxis;c&&(a.inverted&&c.attr({width:a.plotWidth,height:a.plotHeight}),c.animate({translateX:p(d&&d.left,a.plotLeft),translateY:p(e&&e.top,a.plotTop)}));this.translate();this.setTooltipPoints(!0);this.render();b&&K(this,"updatedData")},setState:function(a){var b=this.options,c=this.graph,d=this.graphNeg,e=b.states,b=b.lineWidth,a=a||"";if(this.state!==a)this.state=a,e[a]&&e[a].enabled===!1||(a&&(b=e[a].lineWidth||b+1),c&&!c.dashstyle&&(a={"stroke-width":b},c.attr(a),d&&d.attr(a)))},setVisible:function(a,
b){var c=this,d=c.chart,e=c.legendItem,f,g=d.options.chart.ignoreHiddenSeries,h=c.visible;f=(c.visible=a=c.userOptions.visible=a===w?!h:a)?"show":"hide";n(["group","dataLabelsGroup","markerGroup","tracker"],function(a){if(c[a])c[a][f]()});if(d.hoverSeries===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&n(d.series,function(a){if(a.options.stacking&&a.visible)a.isDirty=!0});n(c.linkedSeries,function(b){b.setVisible(a,!1)});if(g)d.isDirtyBox=!0;b!==!1&&d.redraw();K(c,
f)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=a===w?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;K(this,a?"select":"unselect")},drawTracker:function(){var a=this,b=a.options,c=b.trackByArea,d=[].concat(c?a.areaPath:a.graphPath),e=d.length,f=a.chart,g=f.pointer,h=f.renderer,i=f.options.tooltip.snap,j=a.tracker,k=b.cursor,k=k&&{cursor:k},m=a.singlePoints,l,o=function(){if(f.hoverSeries!==a)a.onMouseOver()};if(e&&!c)for(l=
e+1;l--;)d[l]==="M"&&d.splice(l+1,0,d[l+1]-i,d[l+2],"L"),(l&&d[l]==="M"||l===e)&&d.splice(l,0,"L",d[l-2]+i,d[l-1]);for(l=0;l<m.length;l++)e=m[l],d.push("M",e.plotX-i,e.plotY,"L",e.plotX+i,e.plotY);if(j)j.attr({d:d});else if(a.tracker=j=h.path(d).attr({"class":"highcharts-tracker","stroke-linejoin":"round",visibility:a.visible?"visible":"hidden",stroke:Xb,fill:c?Xb:ba,"stroke-width":b.lineWidth+(c?0:2*i),zIndex:2}).addClass("highcharts-tracker").on("mouseover",o).on("mouseout",function(a){g.onTrackerMouseOut(a)}).css(k).add(a.markerGroup),
gb)j.on("touchstart",o)}};D=ea($);Q.line=D;S.area=z(R,{threshold:0});D=ea($,{type:"area",getSegments:function(){var a=[],b=[],c=[],d=this.xAxis,e=this.yAxis,f=e.stacks[this.stackKey],g={},h,i,j=this.points,k,m;if(this.options.stacking&&!this.cropped){for(k=0;k<j.length;k++)g[j[k].x]=j[k];for(m in f)c.push(+m);c.sort(function(a,b){return a-b});n(c,function(a){g[a]?b.push(g[a]):(h=d.translate(a),i=e.toPixels(f[a].cum,!0),b.push({y:null,plotX:h,clientX:h,plotY:i,yBottom:i,onMouseOver:qa}))});b.length&&
a.push(b)}else $.prototype.getSegments.call(this),a=this.segments;this.segments=a},getSegmentPath:function(a){var b=$.prototype.getSegmentPath.call(this,a),c=[].concat(b),d,e=this.options;b.length===3&&c.push("L",b[1],b[2]);if(e.stacking&&!this.closedStacks)for(d=a.length-1;d>=0;d--)d<a.length-1&&e.step&&c.push(a[d+1].plotX,a[d].yBottom),c.push(a[d].plotX,a[d].yBottom);else this.closeSegment(c,a);this.areaPath=this.areaPath.concat(c);return b},closeSegment:function(a,b){var c=this.yAxis.getThreshold(this.options.threshold);
a.push("L",b[b.length-1].plotX,c,"L",b[0].plotX,c)},drawGraph:function(){this.areaPath=[];$.prototype.drawGraph.apply(this);var a=this,b=this.areaPath,c=this.options,d=[["area",this.color,c.fillColor]];c.negativeColor&&d.push(["areaNeg",c.negativeColor,c.negativeFillColor]);n(d,function(d){var f=d[0],g=a[f];g?g.animate({d:b}):a[f]=a.chart.renderer.path(b).attr({fill:p(d[2],wa(d[1]).setOpacity(c.fillOpacity||0.75).get()),zIndex:0}).add(a.group)})},drawLegendSymbol:function(a,b){b.legendSymbol=this.chart.renderer.rect(0,
a.baseline-11,a.options.symbolWidth,12,2).attr({zIndex:3}).add(b.legendGroup)}});Q.area=D;S.spline=z(R);Z=ea($,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],g=a[c+1],h,i,j,k;if(f&&g){a=f.plotY;j=g.plotX;var g=g.plotY,m;h=(1.5*d+f.plotX)/2.5;i=(1.5*e+a)/2.5;j=(1.5*d+j)/2.5;k=(1.5*e+g)/2.5;m=(k-i)*(j-d)/(j-h)+e-k;i+=m;k+=m;i>a&&i>e?(i=t(a,e),k=2*e-i):i<a&&i<e&&(i=A(a,e),k=2*e-i);k>g&&k>e?(k=t(g,e),i=2*e-k):k<g&&k<e&&(k=A(g,e),i=2*e-k);b.rightContX=j;b.rightContY=k}c?
(b=["C",f.rightContX||f.plotX,f.rightContY||f.plotY,h||d,i||e,d,e],f.rightContX=f.rightContY=null):b=["M",d,e];return b}});Q.spline=Z;S.areaspline=z(S.area);var Va=D.prototype;Z=ea(Z,{type:"areaspline",closedStacks:!0,getSegmentPath:Va.getSegmentPath,closeSegment:Va.closeSegment,drawGraph:Va.drawGraph});Q.areaspline=Z;S.column=z(R,{borderColor:"#FFFFFF",borderWidth:1,borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:0.1,
shadow:!1},select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}},dataLabels:{align:null,verticalAlign:null,y:null},stickyTracking:!1,threshold:0});Z=ea($,{type:"column",tooltipOutsidePlot:!0,requireSorting:!1,pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color",r:"borderRadius"},trackerGroups:["group","dataLabelsGroup"],init:function(){$.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&n(b.series,function(b){if(b.type===a.type)b.isDirty=!0})},
getColumnMetrics:function(){var a=this,b=a.chart,c=a.options,d=this.xAxis,e=d.reversed,f,g={},h,i=0;c.grouping===!1?i=1:n(b.series,function(b){var c=b.options;if(b.type===a.type&&b.visible&&a.options.group===c.group)c.stacking?(f=b.stackKey,g[f]===w&&(g[f]=i++),h=g[f]):c.grouping!==!1&&(h=i++),b.columnIndex=h});var b=A(U(d.transA)*(d.ordinalSlope||c.pointRange||d.closestPointRange||1),d.len),d=b*c.groupPadding,j=(b-2*d)/i,k=c.pointWidth,c=v(k)?(j-k)/2:j*c.pointPadding,k=p(k,j-2*c);return a.columnMetrics=
{width:k,offset:c+(d+((e?i-(a.columnIndex||0):a.columnIndex)||0)*j-b/2)*(e?-1:1)}},translate:function(){var a=this,b=a.chart,c=a.options,d=c.stacking,e=c.borderWidth,f=a.yAxis,g=a.translatedThreshold=f.getThreshold(c.threshold),h=p(c.minPointLength,5),c=a.getColumnMetrics(),i=c.width,j=pa(t(i,1+2*e)),k=c.offset;$.prototype.translate.apply(a);n(a.points,function(c){var l=A(t(-999,c.plotY),f.len+999),o=p(c.yBottom,g),q=c.plotX+k,n=pa(A(l,o)),l=pa(t(l,o)-n),u=f.stacks[(c.y<0?"-":"")+a.stackKey];d&&a.visible&&
u&&u[c.x]&&u[c.x].setOffset(k,j);U(l)<h&&h&&(l=h,n=U(n-g)>h?o-h:g-(f.translate(c.y,0,1,0,1)<=g?h:0));c.barX=q;c.pointWidth=i;c.shapeType="rect";c.shapeArgs=c=b.renderer.Element.prototype.crisp.call(0,e,q,n,j,l);e%2&&(c.y-=1,c.height+=1)})},getSymbol:qa,drawLegendSymbol:D.prototype.drawLegendSymbol,drawGraph:qa,drawPoints:function(){var a=this,b=a.options,c=a.chart.renderer,d;n(a.points,function(e){var f=e.plotY,g=e.graphic;if(f!==w&&!isNaN(f)&&e.y!==null)d=e.shapeArgs,g?(hb(g),g.animate(z(d))):e.graphic=
c[e.shapeType](d).attr(e.pointAttr[e.selected?"select":""]).add(a.group).shadow(b.shadow,null,b.stacking&&!b.borderRadius);else if(g)e.graphic=g.destroy()})},drawTracker:function(){var a=this,b=a.chart.pointer,c=a.options.cursor,d=c&&{cursor:c},e=function(b){var c=b.target,d;for(a.onMouseOver();c&&!d;)d=c.point,c=c.parentNode;if(d!==w)d.onMouseOver(b)};n(a.points,function(a){if(a.graphic)a.graphic.element.point=a;if(a.dataLabel)a.dataLabel.element.point=a});a._hasTracking?a._hasTracking=!0:n(a.trackerGroups,
function(c){if(a[c]&&(a[c].addClass("highcharts-tracker").on("mouseover",e).on("mouseout",function(a){b.onTrackerMouseOut(a)}).css(d),gb))a[c].on("touchstart",e)})},alignDataLabel:function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=a.dlBox||a.shapeArgs,i=a.below||a.plotY>p(this.translatedThreshold,f.plotSizeY),j=p(c.inside,!!this.options.stacking);if(h&&(d=z(h),g&&(d={x:f.plotWidth-d.y-d.height,y:f.plotHeight-d.x-d.width,width:d.height,height:d.width}),!j))g?(d.x+=i?0:d.width,d.width=0):(d.y+=i?d.height:
0,d.height=0);c.align=p(c.align,!g||j?"center":i?"right":"left");c.verticalAlign=p(c.verticalAlign,g||j?"middle":i?"top":"bottom");$.prototype.alignDataLabel.call(this,a,b,c,d,e)},animate:function(a){var b=this.yAxis,c=this.options,d=this.chart.inverted,e={};if(ca)a?(e.scaleY=0.001,a=A(b.pos+b.len,t(b.pos,b.toPixels(c.threshold))),d?e.translateX=a-b.len:e.translateY=a,this.group.attr(e)):(e.scaleY=1,e[d?"translateX":"translateY"]=b.pos,this.group.animate(e,this.options.animation),this.animate=null)},
remove:function(){var a=this,b=a.chart;b.hasRendered&&n(b.series,function(b){if(b.type===a.type)b.isDirty=!0});$.prototype.remove.apply(a,arguments)}});Q.column=Z;S.bar=z(S.column);Va=ea(Z,{type:"bar",inverted:!0});Q.bar=Va;S.scatter=z(R,{lineWidth:0,tooltip:{headerFormat:'<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>',pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>",followPointer:!0},stickyTracking:!1});Va=ea($,{type:"scatter",sorted:!1,requireSorting:!1,
noSharedTooltip:!0,trackerGroups:["markerGroup"],drawTracker:Z.prototype.drawTracker,setTooltipPoints:qa});Q.scatter=Va;S.pie=z(R,{borderColor:"#FFFFFF",borderWidth:1,center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{distance:30,enabled:!0,formatter:function(){return this.point.name}},ignoreHiddenPoint:!0,legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,states:{hover:{brightness:0.1,shadow:!1}},stickyTracking:!1,tooltip:{followPointer:!0}});R={type:"pie",isCartesian:!1,
pointClass:ea(Ha,{init:function(){Ha.prototype.init.apply(this,arguments);var a=this,b;if(a.y<0)a.y=null;y(a,{visible:a.visible!==!1,name:p(a.name,"Slice")});b=function(){a.slice()};F(a,"select",b);F(a,"unselect",b);return a},setVisible:function(a){var b=this,c=b.series,d=c.chart,e;b.visible=b.options.visible=a=a===w?!b.visible:a;c.options.data[va(b,c.data)]=b.options;e=a?"show":"hide";n(["graphic","dataLabel","connector","shadowGroup"],function(a){if(b[a])b[a][e]()});b.legendItem&&d.legend.colorizeItem(b,
a);if(!c.isDirty&&c.options.ignoreHiddenPoint)c.isDirty=!0,d.redraw()},slice:function(a,b,c){var d=this.series;$a(c,d.chart);p(b,!0);this.sliced=this.options.sliced=a=v(a)?a:!this.sliced;d.options.data[va(this,d.data)]=this.options;a=a?this.slicedTranslation:{translateX:0,translateY:0};this.graphic.animate(a);this.shadowGroup&&this.shadowGroup.animate(a)}}),requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",
fill:"color"},getColor:qa,animate:function(a){var b=this,c=b.points,d=b.startAngleRad;if(!a)n(c,function(a){var c=a.graphic,a=a.shapeArgs;c&&(c.attr({r:b.center[3]/2,start:d,end:d}),c.animate({r:a.r,start:a.start,end:a.end},b.options.animation))}),b.animate=null},setData:function(a,b){$.prototype.setData.call(this,a,!1);this.processData();this.generatePoints();p(b,!0)&&this.chart.redraw()},getCenter:function(){var a=this.options,b=this.chart,c=2*(a.slicedOffset||0),d,e=b.plotWidth-2*c,f=b.plotHeight-
2*c,b=a.center,a=[p(b[0],"50%"),p(b[1],"50%"),a.size||"100%",a.innerSize||0],g=A(e,f),h;return Fa(a,function(a,b){h=/%$/.test(a);d=b<2||b===2&&h;return(h?[e,f,g,g][b]*C(a)/100:a)+(d?c:0)})},translate:function(a){this.generatePoints();var b=0,c=0,d=this.options,e=d.slicedOffset,f=e+d.borderWidth,g,h,i,j=this.startAngleRad=bb/180*((d.startAngle||0)%360-90),k=this.points,m=2*bb,l=d.dataLabels.distance,o=d.ignoreHiddenPoint,q,n=k.length,p;if(!a)this.center=a=this.getCenter();this.getX=function(b,c){i=
P.asin((b-a[1])/(a[2]/2+l));return a[0]+(c?-1:1)*ha(i)*(a[2]/2+l)};for(q=0;q<n;q++)p=k[q],b+=o&&!p.visible?0:p.y;for(q=0;q<n;q++){p=k[q];d=b?p.y/b:0;g=r((j+c*m)*1E3)/1E3;if(!o||p.visible)c+=d;h=r((j+c*m)*1E3)/1E3;p.shapeType="arc";p.shapeArgs={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:g,end:h};i=(h+g)/2;i>0.75*m&&(i-=2*bb);p.slicedTranslation={translateX:r(ha(i)*e),translateY:r(ka(i)*e)};g=ha(i)*a[2]/2;h=ka(i)*a[2]/2;p.tooltipPos=[a[0]+g*0.7,a[1]+h*0.7];p.half=i<m/4?0:1;p.angle=i;f=A(f,l/2);p.labelPos=
[a[0]+g+ha(i)*l,a[1]+h+ka(i)*l,a[0]+g+ha(i)*f,a[1]+h+ka(i)*f,a[0]+g,a[1]+h,l<0?"center":p.half?"right":"left",i];p.percentage=d*100;p.total=b}this.setTooltipPoints()},drawGraph:null,drawPoints:function(){var a=this,b=a.chart.renderer,c,d,e=a.options.shadow,f,g;if(e&&!a.shadowGroup)a.shadowGroup=b.g("shadow").add(a.group);n(a.points,function(h){d=h.graphic;g=h.shapeArgs;f=h.shadowGroup;if(e&&!f)f=h.shadowGroup=b.g("shadow").add(a.shadowGroup);c=h.sliced?h.slicedTranslation:{translateX:0,translateY:0};
f&&f.attr(c);d?d.animate(y(g,c)):h.graphic=d=b.arc(g).setRadialReference(a.center).attr(h.pointAttr[h.selected?"select":""]).attr({"stroke-linejoin":"round"}).attr(c).add(a.group).shadow(e,f);h.visible===!1&&h.setVisible(!1)})},drawDataLabels:function(){var a=this,b=a.data,c,d=a.chart,e=a.options.dataLabels,f=p(e.connectorPadding,10),g=p(e.connectorWidth,1),h=d.plotWidth,d=d.plotHeight,i,j,k=p(e.softConnector,!0),m=e.distance,l=a.center,o=l[2]/2,q=l[1],v=m>0,u,s,x,w,z=[[],[]],E,B,y,A,J,C=[0,0,0,0],
db=function(a,b){return b.y-a.y},F=function(a,b){a.sort(function(a,c){return a.angle!==void 0&&(c.angle-a.angle)*b})};if(e.enabled||a._hasPointLabels){$.prototype.drawDataLabels.apply(a);n(b,function(a){a.dataLabel&&z[a.half].push(a)});for(A=0;!w&&b[A];)w=b[A]&&b[A].dataLabel&&(b[A].dataLabel.getBBox().height||21),A++;for(A=2;A--;){var b=[],G=[],I=z[A],H=I.length,D;F(I,A-0.5);if(m>0){for(J=q-o-m;J<=q+o+m;J+=w)b.push(J);s=b.length;if(H>s){c=[].concat(I);c.sort(db);for(J=H;J--;)c[J].rank=J;for(J=H;J--;)I[J].rank>=
s&&I.splice(J,1);H=I.length}for(J=0;J<H;J++){c=I[J];x=c.labelPos;c=9999;var K,L;for(L=0;L<s;L++)K=U(b[L]-x[1]),K<c&&(c=K,D=L);if(D<J&&b[J]!==null)D=J;else for(s<H-J+D&&b[J]!==null&&(D=s-H+J);b[D]===null;)D++;G.push({i:D,y:b[D]});b[D]=null}G.sort(db)}for(J=0;J<H;J++){c=I[J];x=c.labelPos;u=c.dataLabel;y=c.visible===!1?"hidden":"visible";c=x[1];if(m>0){if(s=G.pop(),D=s.i,B=s.y,c>B&&b[D+1]!==null||c<B&&b[D-1]!==null)B=c}else B=c;E=e.justify?l[0]+(A?-1:1)*(o+m):a.getX(D===0||D===b.length-1?c:B,A);u._attr=
{visibility:y,align:x[6]};u._pos={x:E+e.x+({left:f,right:-f}[x[6]]||0),y:B+e.y-10};u.connX=E;u.connY=B;if(this.options.size===null)s=u.width,E-s<f?C[3]=t(r(s-E+f),C[3]):E+s>h-f&&(C[1]=t(r(E+s-h+f),C[1])),B-w/2<0?C[0]=t(r(-B+w/2),C[0]):B+w/2>d&&(C[2]=t(r(B+w/2-d),C[2]))}}if(ua(C)===0||this.verifyDataLabelOverflow(C))this.placeDataLabels(),v&&g&&n(this.points,function(b){i=b.connector;x=b.labelPos;if((u=b.dataLabel)&&u._pos)y=u._attr.visibility,E=u.connX,B=u.connY,j=k?["M",E+(x[6]==="left"?5:-5),B,
"C",E,B,2*x[2]-x[4],2*x[3]-x[5],x[2],x[3],"L",x[4],x[5]]:["M",E+(x[6]==="left"?5:-5),B,"L",x[2],x[3],"L",x[4],x[5]],i?(i.animate({d:j}),i.attr("visibility",y)):b.connector=i=a.chart.renderer.path(j).attr({"stroke-width":g,stroke:e.connectorColor||b.color||"#606060",visibility:y}).add(a.group);else if(i)b.connector=i.destroy()})}},verifyDataLabelOverflow:function(a){var b=this.center,c=this.options,d=c.center,e=c=c.minSize||80,f;d[0]!==null?e=t(b[2]-t(a[1],a[3]),c):(e=t(b[2]-a[1]-a[3],c),b[0]+=(a[3]-
a[1])/2);d[1]!==null?e=t(A(e,b[2]-t(a[0],a[2])),c):(e=t(A(e,b[2]-a[0]-a[2]),c),b[1]+=(a[0]-a[2])/2);e<b[2]?(b[2]=e,this.translate(b),n(this.points,function(a){if(a.dataLabel)a.dataLabel._pos=null}),this.drawDataLabels()):f=!0;return f},placeDataLabels:function(){n(this.points,function(a){var a=a.dataLabel,b;if(a)(b=a._pos)?(a.attr(a._attr),a[a.moved?"animate":"attr"](b),a.moved=!0):a&&a.attr({y:-999})})},alignDataLabel:qa,drawTracker:Z.prototype.drawTracker,drawLegendSymbol:D.prototype.drawLegendSymbol,
getSymbol:qa};R=ea($,R);Q.pie=R;var V=$.prototype,fc=V.processData,gc=V.generatePoints,hc=V.destroy,ic=V.tooltipHeaderFormatter,jc={approximation:"average",groupPixelWidth:2,dateTimeLabelFormats:jb(kb,["%A, %b %e, %H:%M:%S.%L","%A, %b %e, %H:%M:%S.%L","-%H:%M:%S.%L"],eb,["%A, %b %e, %H:%M:%S","%A, %b %e, %H:%M:%S","-%H:%M:%S"],Ya,["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],za,["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],ga,["%A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],Ma,["Week from %A, %b %e, %Y",
"%A, %b %e","-%A, %b %e, %Y"],Na,["%B %Y","%B","-%B %Y"],ta,["%Y","%Y","-%Y"])},ac={line:{},spline:{},area:{},areaspline:{},column:{approximation:"sum",groupPixelWidth:10},arearange:{approximation:"range"},areasplinerange:{approximation:"range"},columnrange:{approximation:"range",groupPixelWidth:10},candlestick:{approximation:"ohlc",groupPixelWidth:10},ohlc:{approximation:"ohlc",groupPixelWidth:5}},bc=[[kb,[1,2,5,10,20,25,50,100,200,500]],[eb,[1,2,5,10,15,30]],[Ya,[1,2,5,10,15,30]],[za,[1,2,3,4,6,
8,12]],[ga,[1]],[Ma,[1]],[Na,[1,3,6]],[ta,null]],Ia={sum:function(a){var b=a.length,c;if(!b&&a.hasNulls)c=null;else if(b)for(c=0;b--;)c+=a[b];return c},average:function(a){var b=a.length,a=Ia.sum(a);typeof a==="number"&&b&&(a/=b);return a},open:function(a){return a.length?a[0]:a.hasNulls?null:w},high:function(a){return a.length?ua(a):a.hasNulls?null:w},low:function(a){return a.length?Pa(a):a.hasNulls?null:w},close:function(a){return a.length?a[a.length-1]:a.hasNulls?null:w},ohlc:function(a,b,c,d){a=
Ia.open(a);b=Ia.high(b);c=Ia.low(c);d=Ia.close(d);if(typeof a==="number"||typeof b==="number"||typeof c==="number"||typeof d==="number")return[a,b,c,d]},range:function(a,b){a=Ia.low(a);b=Ia.high(b);if(typeof a==="number"||typeof b==="number")return[a,b]}};V.groupData=function(a,b,c,d){var e=this.data,f=this.options.data,g=[],h=[],i=a.length,j,k,m=!!b,l=[[],[],[],[]],d=typeof d==="function"?d:Ia[d],o=this.pointArrayMap,q=o&&o.length,n;for(n=0;n<=i;n++){for(;c[1]!==w&&a[n]>=c[1]||n===i;)if(j=c.shift(),
k=d.apply(0,l),k!==w&&(g.push(j),h.push(k)),l[0]=[],l[1]=[],l[2]=[],l[3]=[],n===i)break;if(n===i)break;if(o){j=this.cropStart+n;j=e&&e[j]||this.pointClass.prototype.applyOptions.apply({series:this},[f[j]]);var p;for(k=0;k<q;k++)if(p=j[o[k]],typeof p==="number")l[k].push(p);else if(p===null)l[k].hasNulls=!0}else if(j=m?b[n]:null,typeof j==="number")l[0].push(j);else if(j===null)l[0].hasNulls=!0}return[g,h]};V.processData=function(){var a=this.chart,b=this.options,c=b.dataGrouping,d=c&&p(c.enabled,
a.options._stock),e;this.forceCrop=d;if(fc.apply(this,arguments)!==!1&&d){this.destroyGroupedData();var d=this.processedXData,f=this.processedYData,g=a.plotSizeX,h=this.xAxis,i=p(h.groupPixelWidth,c.groupPixelWidth),j=d.length,k=a.series,m=this.pointRange;if(!h.groupPixelWidth){for(a=k.length;a--;)k[a].xAxis===h&&k[a].options.dataGrouping&&(i=t(i,k[a].options.dataGrouping.groupPixelWidth));h.groupPixelWidth=i}if(j>g/i||j&&c.forced){e=!0;this.points=null;a=h.getExtremes();j=a.min;k=a.max;a=h.getGroupIntervalFactor&&
h.getGroupIntervalFactor(j,k,d)||1;g=i*(k-j)/g*a;h=(h.getNonLinearTimeTicks||fb)(zb(g,c.units||bc),j,k,null,d,this.closestPointRange);f=V.groupData.apply(this,[d,f,h,c.approximation]);d=f[0];f=f[1];if(c.smoothed){a=d.length-1;for(d[a]=k;a--&&a>0;)d[a]+=g/2;d[0]=j}this.currentDataGrouping=h.info;if(b.pointRange===null)this.pointRange=h.info.totalRange;this.closestPointRange=h.info.totalRange;this.processedXData=d;this.processedYData=f}else this.currentDataGrouping=null,this.pointRange=m;this.hasGroupedData=
e}};V.destroyGroupedData=function(){var a=this.groupedData;n(a||[],function(b,c){b&&(a[c]=b.destroy?b.destroy():null)});this.groupedData=null};V.generatePoints=function(){gc.apply(this);this.destroyGroupedData();this.groupedData=this.hasGroupedData?this.points:null};V.tooltipHeaderFormatter=function(a){var b=this.tooltipOptions,c=this.options.dataGrouping,d=b.xDateFormat,e,f=this.xAxis,g,h;if(f&&f.options.type==="datetime"&&c&&Ja(a.key)){g=this.currentDataGrouping;c=c.dateTimeLabelFormats;if(g)f=
c[g.unitName],g.count===1?d=f[0]:(d=f[1],e=f[2]);else if(!d&&c)for(h in I)if(I[h]>=f.closestPointRange){d=c[h][0];break}d=ya(d,a.key);e&&(d+=ya(e,a.key+g.totalRange-1));a=b.headerFormat.replace("{point.key}",d)}else a=ic.call(this,a);return a};V.destroy=function(){for(var a=this.groupedData||[],b=a.length;b--;)a[b]&&a[b].destroy();hc.apply(this)};sa(V,"setOptions",function(a,b){var c=a.call(this,b),d=this.type,e=this.chart.options.plotOptions,f=S[d].dataGrouping;if(ac[d])f||(f=z(jc,ac[d])),c.dataGrouping=
z(f,e.series&&e.series.dataGrouping,e[d].dataGrouping,b.dataGrouping);if(this.chart.options._stock)this.requireSorting=!0;return c});S.ohlc=z(S.column,{lineWidth:1,tooltip:{pointFormat:'<span style="color:{series.color};font-weight:bold">{series.name}</span><br/>Open: {point.open}<br/>High: {point.high}<br/>Low: {point.low}<br/>Close: {point.close}<br/>'},states:{hover:{lineWidth:3}},threshold:null});R=ea(Q.column,{type:"ohlc",pointArrayMap:["open","high","low","close"],toYData:function(a){return[a.open,
a.high,a.low,a.close]},pointValKey:"high",pointAttrToOptions:{stroke:"color","stroke-width":"lineWidth"},upColorProp:"stroke",getAttribs:function(){Q.column.prototype.getAttribs.apply(this,arguments);var a=this.options,b=a.states,a=a.upColor||this.color,c=z(this.pointAttr),d=this.upColorProp;c[""][d]=a;c.hover[d]=b.hover.upColor||a;c.select[d]=b.select.upColor||a;n(this.points,function(a){if(a.open<a.close)a.pointAttr=c})},translate:function(){var a=this.yAxis;Q.column.prototype.translate.apply(this);
n(this.points,function(b){if(b.open!==null)b.plotOpen=a.translate(b.open,0,1,0,1);if(b.close!==null)b.plotClose=a.translate(b.close,0,1,0,1)})},drawPoints:function(){var a=this,b=a.chart,c,d,e,f,g,h,i,j;n(a.points,function(k){if(k.plotY!==w)i=k.graphic,c=k.pointAttr[k.selected?"selected":""],f=c["stroke-width"]%2/2,j=r(k.plotX)+f,g=r(k.shapeArgs.width/2),h=["M",j,r(k.yBottom),"L",j,r(k.plotY)],k.open!==null&&(d=r(k.plotOpen)+f,h.push("M",j,d,"L",j-g,d)),k.close!==null&&(e=r(k.plotClose)+f,h.push("M",
j,e,"L",j+g,e)),i?i.animate({d:h}):k.graphic=b.renderer.path(h).attr(c).add(a.group)})},animate:null});Q.ohlc=R;S.candlestick=z(S.column,{lineColor:"black",lineWidth:1,states:{hover:{lineWidth:2}},tooltip:S.ohlc.tooltip,threshold:null,upColor:"white"});R=ea(R,{type:"candlestick",pointAttrToOptions:{fill:"color",stroke:"lineColor","stroke-width":"lineWidth"},upColorProp:"fill",drawPoints:function(){var a=this,b=a.chart,c,d,e,f,g,h,i,j,k,m;n(a.points,function(l){j=l.graphic;if(l.plotY!==w)c=l.pointAttr[l.selected?
"selected":""],h=c["stroke-width"]%2/2,i=r(l.plotX)+h,d=r(l.plotOpen)+h,e=r(l.plotClose)+h,f=P.min(d,e),g=P.max(d,e),m=r(l.shapeArgs.width/2),k=["M",i-m,g,"L",i-m,f,"L",i+m,f,"L",i+m,g,"L",i-m,g,"M",i,g,"L",i,r(l.yBottom),"M",i,f,"L",i,r(l.plotY),"Z"],j?j.animate({d:k}):l.graphic=b.renderer.path(k).attr(c).add(a.group)})}});Q.candlestick=R;var xb=Ga.prototype.symbols;S.flags=z(S.column,{dataGrouping:null,fillColor:"white",lineWidth:1,pointRange:0,shape:"flag",stackDistance:7,states:{hover:{lineColor:"black",
fillColor:"#FCFFC5"}},style:{fontSize:"11px",fontWeight:"bold",textAlign:"center"},tooltip:{pointFormat:"{point.text}<br/>"},threshold:null,y:-30});Q.flags=ea(Q.column,{type:"flags",sorted:!1,noSharedTooltip:!0,takeOrdinalPosition:!1,forceCrop:!0,init:$.prototype.init,pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth",r:"radius"},translate:function(){Q.column.prototype.translate.apply(this);var a=this.chart,b=this.points,c=b.length-1,d,e,f=this.options.onSeries,f=(d=f&&
a.get(f))&&d.options.step,g=d&&d.points,h=g&&g.length,i=this.xAxis,j=i.getExtremes(),k,m,l;if(d&&d.visible&&h){m=g[h-1].x;for(b.sort(function(a,b){return a.x-b.x});h--&&b[c];)if(d=b[c],k=g[h],k.x<=d.x&&k.plotY!==w){if(d.x<=m)d.plotY=k.plotY,k.x<d.x&&!f&&(l=g[h+1])&&l.plotY!==w&&(d.plotY+=(d.x-k.x)/(l.x-k.x)*(l.plotY-k.plotY));c--;h++;if(c<0)break}}n(b,function(c,d){if(c.plotY===w)c.x>=j.min&&c.x<=j.max?c.plotY=i.lineTop-a.plotTop:c.shapeArgs={};if((e=b[d-1])&&e.plotX===c.plotX){if(e.stackIndex===
w)e.stackIndex=0;c.stackIndex=e.stackIndex+1}})},drawPoints:function(){var a,b=this.points,c=this.chart.renderer,d,e,f=this.options,g=f.y,h,i,j,k,m,l=f.lineWidth%2/2,o;for(j=b.length;j--;)if(k=b[j],d=k.plotX+l,a=k.stackIndex,h=k.options.shape||f.shape,e=k.plotY,e!==w&&(e=k.plotY+g+l-(a!==w&&a*f.stackDistance)),i=a?w:k.plotX+l,o=a?w:k.plotY,m=k.graphic,e!==w)a=k.pointAttr[k.selected?"select":""],m?m.attr({x:d,y:e,r:a.r,anchorX:i,anchorY:o}):m=k.graphic=c.label(k.options.title||f.title||"A",d,e,h,i,
o,f.useHTML).css(z(f.style,k.style)).attr(a).attr({align:h==="flag"?"left":"center",width:f.width,height:f.height}).add(this.group).shadow(f.shadow),i=m.box,a=i.getBBox(),k.shapeArgs=y(a,{x:d-(h==="flag"?0:i.attr("width")/2),y:e});else if(m)k.graphic=m.destroy()},drawTracker:function(){Q.column.prototype.drawTracker.apply(this);ca&&n(this.points,function(a){a.graphic&&F(a.graphic.element,"mouseover",function(){a.graphic.toFront()})})},animate:qa});xb.flag=function(a,b,c,d,e){var f=e&&e.anchorX||a,
e=e&&e.anchorY||b;return["M",f,e,"L",a,b+d,a,b,a+c,b,a+c,b+d,a,b+d,"M",f,e,"Z"]};n(["circle","square"],function(a){xb[a+"pin"]=function(b,c,d,e,f){var g=f&&f.anchorX,f=f&&f.anchorY,b=xb[a](b,c,d,e);g&&f&&b.push("M",g,c>f?c:c+e,"L",g,f);return b}});cb===ib&&n(["flag","circlepin","squarepin"],function(a){ib.prototype.symbols[a]=xb[a]});R=jb("linearGradient",{x1:0,y1:0,x2:0,y2:1},"stops",[[0,"#FFF"],[1,"#CCC"]]);D=[].concat(bc);D[4]=[ga,[1,2,3,4]];D[5]=[Ma,[1,2,3]];y(M,{navigator:{handles:{backgroundColor:"#FFF",
borderColor:"#666"},height:40,margin:10,maskFill:"rgba(255, 255, 255, 0.75)",outlineColor:"#444",outlineWidth:1,series:{type:"areaspline",color:"#4572A7",compare:null,fillOpacity:0.4,dataGrouping:{approximation:"average",groupPixelWidth:2,smoothed:!0,units:D},dataLabels:{enabled:!1,zIndex:2},id:"highcharts-navigator-series",lineColor:"#4572A7",lineWidth:1,marker:{enabled:!1},pointRange:0,shadow:!1},xAxis:{tickWidth:0,lineWidth:0,gridLineWidth:1,tickPixelInterval:200,labels:{align:"left",x:3,y:-4}},
yAxis:{gridLineWidth:0,startOnTick:!1,endOnTick:!1,minPadding:0.1,maxPadding:0.1,labels:{enabled:!1},title:{text:null},tickWidth:0}},scrollbar:{height:ub?20:14,barBackgroundColor:R,barBorderRadius:2,barBorderWidth:1,barBorderColor:"#666",buttonArrowColor:"#666",buttonBackgroundColor:R,buttonBorderColor:"#666",buttonBorderRadius:2,buttonBorderWidth:1,minWidth:6,rifleColor:"#666",trackBackgroundColor:jb("linearGradient",{x1:0,y1:0,x2:0,y2:1},"stops",[[0,"#EEE"],[1,"#FFF"]]),trackBorderColor:"#CCC",
trackBorderWidth:1,liveRedraw:ca}});Ib.prototype={drawHandle:function(a,b){var c=this.chart,d=c.renderer,e=this.elementsToDestroy,f=this.handles,g=this.navigatorOptions.handles,g={fill:g.backgroundColor,stroke:g.borderColor,"stroke-width":1},h;this.rendered||(f[b]=d.g().css({cursor:"e-resize"}).attr({zIndex:4-b}).add(),h=d.rect(-4.5,0,9,16,3,1).attr(g).add(f[b]),e.push(h),h=d.path(["M",-1.5,4,"L",-1.5,12,"M",0.5,4,"L",0.5,12]).attr(g).add(f[b]),e.push(h));f[b][c.isResizing?"animate":"attr"]({translateX:this.scrollerLeft+
this.scrollbarHeight+parseInt(a,10),translateY:this.top+this.height/2-8})},drawScrollbarButton:function(a){var b=this.chart.renderer,c=this.elementsToDestroy,d=this.scrollbarButtons,e=this.scrollbarHeight,f=this.scrollbarOptions,g;this.rendered||(d[a]=b.g().add(this.scrollbarGroup),g=b.rect(-0.5,-0.5,e+1,e+1,f.buttonBorderRadius,f.buttonBorderWidth).attr({stroke:f.buttonBorderColor,"stroke-width":f.buttonBorderWidth,fill:f.buttonBackgroundColor}).add(d[a]),c.push(g),g=b.path(["M",e/2+(a?-1:1),e/2-
3,"L",e/2+(a?-1:1),e/2+3,e/2+(a?2:-2),e/2]).attr({fill:f.buttonArrowColor}).add(d[a]),c.push(g));a&&d[a].attr({translateX:this.scrollerWidth-e})},render:function(a,b,c,d){var e=this.chart,f=e.renderer,g,h,i,j,k=this.scrollbarGroup,m=this.navigatorGroup,l=this.scrollbar,m=this.xAxis,o=this.scrollbarTrack,n=this.scrollbarHeight,v=this.scrollbarEnabled,u=this.navigatorOptions,s=this.scrollbarOptions,x=s.minWidth,w=this.height,z=this.top,E=this.navigatorEnabled,B=u.outlineWidth,y=B/2,D=0,J=this.outlineHeight,
I=s.barBorderRadius,H=s.barBorderWidth,F=z+y;if(!isNaN(a)){this.navigatorLeft=g=p(m.left,e.plotLeft+n);this.navigatorWidth=h=p(m.len,e.plotWidth-2*n);this.scrollerLeft=i=g-n;this.scrollerWidth=j=j=h+2*n;if(m.getExtremes){var G=e.xAxis[0].getExtremes(),L=G.dataMin===null,K=m.getExtremes(),M=A(G.dataMin,K.dataMin),G=t(G.dataMax,K.dataMax);!L&&(M!==K.min||G!==K.max)&&m.setExtremes(M,G,!0,!1)}c=p(c,m.translate(a));d=p(d,m.translate(b));this.zoomedMax=a=A(C(t(c,d)),h);this.zoomedMin=d=this.fixedWidth?
a-this.fixedWidth:t(C(A(c,d)),0);this.range=c=a-d;if(!this.rendered){if(E)this.navigatorGroup=m=f.g("navigator").attr({zIndex:3}).add(),this.leftShade=f.rect().attr({fill:u.maskFill}).add(m),this.rightShade=f.rect().attr({fill:u.maskFill}).add(m),this.outline=f.path().attr({"stroke-width":B,stroke:u.outlineColor}).add(m);if(v)this.scrollbarGroup=k=f.g("scrollbar").add(),l=s.trackBorderWidth,this.scrollbarTrack=o=f.rect().attr({y:-l%2/2,fill:s.trackBackgroundColor,stroke:s.trackBorderColor,"stroke-width":l,
r:s.trackBorderRadius||0,height:n}).add(k),this.scrollbar=l=f.rect().attr({y:-H%2/2,height:n,fill:s.barBackgroundColor,stroke:s.barBorderColor,"stroke-width":H,r:I}).add(k),this.scrollbarRifles=f.path().attr({stroke:s.rifleColor,"stroke-width":1}).add(k)}e=e.isResizing?"animate":"attr";E&&(this.leftShade[e]({x:g,y:z,width:d,height:w}),this.rightShade[e]({x:g+a,y:z,width:h-a,height:w}),this.outline[e]({d:["M",i,F,"L",g+d+y,F,g+d+y,F+J-n,"M",g+a-y,F+J-n,"L",g+a-y,F,i+j,F]}),this.drawHandle(d+y,0),this.drawHandle(a+
y,1));if(v)this.drawScrollbarButton(0),this.drawScrollbarButton(1),k[e]({translateX:i,translateY:r(F+w)}),o[e]({width:j}),g=n+d,h=c-H,h<x&&(D=(x-h)/2,h=x,g-=D),this.scrollbarPad=D,l[e]({x:W(g)+H%2/2,width:h}),x=n+d+c/2-0.5,this.scrollbarRifles.attr({visibility:c>12?"visible":"hidden"})[e]({d:["M",x-3,n/4,"L",x-3,2*n/3,"M",x,n/4,"L",x,2*n/3,"M",x+3,n/4,"L",x+3,2*n/3]});this.scrollbarPad=D;this.rendered=!0}},addEvents:function(){var a=this.chart.container,b=this.mouseDownHandler,c=this.mouseMoveHandler,
d=this.mouseUpHandler,e;e=[[a,"mousedown",b],[a,"mousemove",c],[document,"mouseup",d]];gb&&e.push([a,"touchstart",b],[a,"touchmove",c],[document,"touchend",d]);n(e,function(a){F.apply(null,a)});this._events=e},removeEvents:function(){n(this._events,function(a){X.apply(null,a)});this._events=w;this.navigatorEnabled&&this.baseSeries&&X(this.baseSeries,"updatedData",this.updatedDataHandler)},init:function(){var a=this,b=a.chart,c,d,e=a.scrollbarHeight,f=a.navigatorOptions,g=a.height,h=a.top,i,j,k,m=
document.body.style,l,o=a.baseSeries,n;a.mouseDownHandler=function(d){var d=b.pointer.normalize(d),e=a.zoomedMin,f=a.zoomedMax,h=a.top,i=a.scrollbarHeight,k=a.scrollerLeft,o=a.scrollerWidth,n=a.navigatorLeft,p=a.navigatorWidth,q=a.scrollbarPad,r=a.range,s=d.chartX,u=d.chartY,d=b.xAxis[0],t=ub?10:7;if(u>h&&u<h+g+i)if((h=!a.scrollbarEnabled||u<h+g)&&P.abs(s-e-n)<t)a.grabbedLeft=!0,a.otherHandlePos=f;else if(h&&P.abs(s-f-n)<t)a.grabbedRight=!0,a.otherHandlePos=e;else if(s>n+e-q&&s<n+f+q){a.grabbedCenter=
s;a.fixedWidth=r;if(b.renderer.isSVG)l=m.cursor,m.cursor="ew-resize";j=s-e}else if(s>k&&s<k+o&&(f=h?s-n-r/2:s<n?e-A(10,r):s>k+o-i?e+A(10,r):s<n+e?e-r:f,f<0?f=0:f+r>p&&(f=p-r),f!==e)){a.fixedWidth=r;if(!d.ordinalPositions)d.fixedRange=d.max-d.min;e=c.translate(f,!0);d.setExtremes(e,d.fixedRange?e+d.fixedRange:c.translate(f+r,!0),!0,!1,{trigger:"navigator"})}};a.mouseMoveHandler=function(c){var d=a.scrollbarHeight,e=a.navigatorLeft,f=a.navigatorWidth,g=a.scrollerLeft,h=a.scrollerWidth,i=a.range,l;if(c.pageX!==
0)c=b.pointer.normalize(c),l=c.chartX,l<e?l=e:l>g+h-d&&(l=g+h-d),a.grabbedLeft?(k=!0,a.render(0,0,l-e,a.otherHandlePos)):a.grabbedRight?(k=!0,a.render(0,0,a.otherHandlePos,l-e)):a.grabbedCenter&&(k=!0,l<j?l=j:l>f+j-i&&(l=f+j-i),a.render(0,0,l-j,l-j+i)),k&&a.scrollbarOptions.liveRedraw&&setTimeout(function(){a.mouseUpHandler(c)},0)};a.mouseUpHandler=function(d){k&&b.xAxis[0].setExtremes(c.translate(a.zoomedMin,!0),c.translate(a.zoomedMax,!0),!0,!1,{trigger:"navigator",DOMEvent:d});if(d.type!=="mousemove")a.grabbedLeft=
a.grabbedRight=a.grabbedCenter=a.fixedWidth=k=j=null,m.cursor=l||""};a.updatedDataHandler=function(){var c=o.xAxis,d=c.getExtremes(),e=d.min,f=d.max,g=d.dataMin,d=d.dataMax,h=f-e,j,k,l,m,p;j=i.xData;var r=!!c.setExtremes;k=f>=j[j.length-1];j=e<=g;if(!n)i.options.pointStart=o.xData[0],i.setData(o.options.data,!1),p=!0;j&&(m=g,l=m+h);k&&(l=d,j||(m=t(l-h,i.xData[0])));r&&(j||k)?c.setExtremes(m,l,!0,!1,{trigger:"updatedData"}):(p&&b.redraw(!1),a.render(t(e,g),A(f,d)))};var r=b.xAxis.length,u=b.yAxis.length;
b.extraBottomMargin=a.outlineHeight+f.margin;if(a.navigatorEnabled){var s=o?o.options:{},x=s.data,v=f.series;n=v.data;a.xAxis=c=new Da(b,z({ordinal:o&&o.xAxis.options.ordinal},f.xAxis,{isX:!0,type:"datetime",index:r,height:g,offset:0,offsetLeft:e,offsetRight:-e,startOnTick:!1,endOnTick:!1,minPadding:0,maxPadding:0,zoomEnabled:!1}));a.yAxis=d=new Da(b,z(f.yAxis,{alignTicks:!1,height:g,offset:0,index:u,zoomEnabled:!1}));r=z(s,v,{threshold:null,clip:!1,enableMouseTracking:!1,group:"nav",padXAxis:!1,
xAxis:r,yAxis:u,name:"Navigator",showInLegend:!1,isInternal:!0,visible:!0});r.data=n||x;i=b.initSeries(r);if(o&&f.adaptToUpdatedData!==!1)F(o,"updatedData",a.updatedDataHandler),o.userOptions.events=y(o.userOptions.event,{updatedData:a.updatedDataHandler})}else a.xAxis=c={translate:function(a,c){var d=b.xAxis[0].getExtremes(),f=b.plotWidth-2*e,g=d.dataMin,d=d.dataMax-g;return c?a*d/f+g:f*(a-g)/d}};a.series=i;sa(b,"getMargins",function(b){var e=this.legend,f=e.options;b.call(this);a.top=h=a.navigatorOptions.top||
this.chartHeight-a.height-a.scrollbarHeight-this.options.chart.spacingBottom-(f.verticalAlign==="bottom"&&f.enabled&&!f.floating?e.legendHeight+p(f.margin,10):0);if(c&&d)c.options.top=d.options.top=h,c.setAxisSize(),d.setAxisSize()});a.addEvents()},destroy:function(){this.removeEvents();n([this.xAxis,this.yAxis,this.leftShade,this.rightShade,this.outline,this.scrollbarTrack,this.scrollbarRifles,this.scrollbarGroup,this.scrollbar],function(a){a&&a.destroy&&a.destroy()});this.xAxis=this.yAxis=this.leftShade=
this.rightShade=this.outline=this.scrollbarTrack=this.scrollbarRifles=this.scrollbarGroup=this.scrollbar=null;n([this.scrollbarButtons,this.handles,this.elementsToDestroy],function(a){Aa(a)})}};Highcharts.Scroller=Ib;sa(Da.prototype,"zoom",function(a,b,c){var d=this.chart,e=d.options,f=e.chart.zoomType,g=e.navigator,e=e.rangeSelector,h;if(this.isXAxis&&(g&&g.enabled||e&&e.enabled))if(f==="x")d.resetZoomButton="blocked";else if(f==="y")h=!1;else if(f==="xy")d=this.previousZoom,v(b)?this.previousZoom=
[this.min,this.max]:d&&(b=d[0],c=d[1],delete this.previousZoom);return h!==w?h:a.call(this,b,c)});sa(Sa.prototype,"init",function(a,b,c){F(this,"beforeRender",function(){var a=this.options;if(a.navigator.enabled||a.scrollbar.enabled)this.scroller=new Ib(this)});a.call(this,b,c)});y(M,{rangeSelector:{buttonTheme:{width:28,height:16,padding:1,r:0,stroke:"#68A",zIndex:7},inputPosition:{align:"right"},labelStyle:{color:"#666"}}});M.lang=z(M.lang,{rangeSelectorZoom:"Zoom",rangeSelectorFrom:"From",rangeSelectorTo:"To"});
Jb.prototype={clickButton:function(a,b,c){var d=this,e=d.chart,f=d.buttons,g=e.xAxis[0],h=g&&g.getExtremes(),i=e.scroller&&e.scroller.xAxis,j=i&&i.getExtremes&&i.getExtremes(),i=j&&j.dataMin,j=j&&j.dataMax,k=h&&h.dataMin,m=h&&h.dataMax,l=(v(k)&&v(i)?A:p)(k,i),o=(v(m)&&v(j)?t:p)(m,j),q,h=g&&A(h.max,p(o,h.max)),i=new Date(h),j=b.type,k=b.count,r,u,m={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5};if(!(l===null||o===null||a===d.selected)){if(m[j])r=m[j]*k,q=t(h-r,l);else if(j===
"month"||j==="year")r={month:"Month",year:"FullYear"}[j],i["set"+r](i["get"+r]()-k),q=t(i.getTime(),p(l,Number.MIN_VALUE)),r={month:30,year:365}[j]*864E5*k;else if(j==="ytd")if(g){if(o===w)l=Number.MAX_VALUE,o=Number.MIN_VALUE,n(e.series,function(a){a=a.xData;l=A(a[0],l);o=t(a[a.length-1],o)}),c=!1;h=new Date(o);u=h.getFullYear();q=u=t(l||0,Date.UTC(u,0,1));h=h.getTime();h=A(o||h,h)}else{F(e,"beforeRender",function(){d.clickButton(a,b)});return}else j==="all"&&g&&(q=l,h=o);f[a]&&f[a].setState(2);
g?g.setExtremes(q,h,p(c,1),0,{trigger:"rangeSelectorButton",rangeSelectorButton:b}):(c=e.options.xAxis,c[0]=z(c[0],{range:r,min:u}));d.selected=a}},defaultButtons:[{type:"month",count:1,text:"1m"},{type:"month",count:3,text:"3m"},{type:"month",count:6,text:"6m"},{type:"ytd",text:"YTD"},{type:"year",count:1,text:"1y"},{type:"all",text:"All"}],init:function(a){var b=this,c=a.options.rangeSelector,d=c.buttons||[].concat(b.defaultButtons),e=b.buttons=[],c=c.selected,f=b.blurInputs=function(){var a=b.minInput,
c=b.maxInput;a&&a.blur();c&&c.blur()};b.chart=a;a.extraTopMargin=25;b.buttonOptions=d;F(a.container,"mousedown",f);F(a,"resize",f);c!==w&&d[c]&&this.clickButton(c,d[c],!1);F(a,"load",function(){F(a.xAxis[0],"afterSetExtremes",function(){if(this.fixedRange!==this.max-this.min)e[b.selected]&&!a.renderer.forExport&&e[b.selected].setState(0),b.selected=null;this.fixedRange=null})})},setInputValue:function(a,b){var c=this.chart.options.rangeSelector;if(b)this[a+"Input"].HCTime=b;this[a+"Input"].value=
ya(c.inputEditDateFormat||"%Y-%m-%d",this[a+"Input"].HCTime);this[a+"DateBox"].attr({text:ya(c.inputDateFormat||"%b %e, %Y",this[a+"Input"].HCTime)})},drawInput:function(a){var b=this,c=b.chart,d=c.options.chart.style,e=c.renderer,f=c.options.rangeSelector,g=b.div,h=a==="min",i,j,k,m=this.inputGroup;this[a+"Label"]=j=e.label(M.lang[h?"rangeSelectorFrom":"rangeSelectorTo"],this.inputGroup.offset).attr({padding:1}).css(z(d,f.labelStyle)).add(m);m.offset+=j.width+5;this[a+"DateBox"]=k=e.label("",m.offset).attr({padding:1,
width:90,height:16,stroke:"silver","stroke-width":1}).css(z({textAlign:"center"},d,f.inputStyle)).on("click",function(){b[a+"Input"].focus()}).add(m);m.offset+=k.width+(h?10:0);this[a+"Input"]=i=aa("input",{name:a,className:"highcharts-range-selector",type:"text"},y({position:"absolute",border:0,width:"1px",height:"1px",padding:0,textAlign:"center",fontSize:d.fontSize,fontFamily:d.fontFamily,top:c.plotTop+"px"},f.inputStyle),g);i.onfocus=function(){L(this,{left:m.translateX+k.x+"px",top:m.translateY+
"px",width:k.width-2+"px",height:k.height-2+"px",border:"2px solid silver"})};i.onblur=function(){L(this,{border:0,width:"1px",height:"1px"});b.setInputValue(a)};i.onchange=function(){var a=i.value,d=Date.parse(a),e=c.xAxis[0].getExtremes();isNaN(d)&&(d=a.split("-"),d=Date.UTC(C(d[0]),C(d[1])-1,C(d[2])));if(!isNaN(d)&&(M.global.useUTC||(d+=(new Date).getTimezoneOffset()*6E4),h&&d>=e.dataMin&&d<=b.maxInput.HCTime||!h&&d<=e.dataMax&&d>=b.minInput.HCTime))c.xAxis[0].setExtremes(h?d:e.min,h?e.max:d,w,
w,{trigger:"rangeSelectorInput"})}},render:function(a,b){var c=this,d=c.chart,e=d.renderer,f=d.container,g=d.options,h=g.exporting&&d.options.navigation.buttonOptions,i=g.rangeSelector,j=c.buttons,k=M.lang,m=c.div,m=c.inputGroup,l=i.buttonTheme,o=i.inputEnabled!==!1,p=l&&l.states,r=d.plotLeft,u;if(!c.rendered&&(c.zoomText=e.text(k.rangeSelectorZoom,r,d.plotTop-10).css(i.labelStyle).add(),u=r+c.zoomText.getBBox().width+5,n(c.buttonOptions,function(a,b){j[b]=e.button(a.text,u,d.plotTop-25,function(){c.clickButton(b,
a);c.isActive=!0},l,p&&p.hover,p&&p.select).css({textAlign:"center"}).add();u+=j[b].width+(i.buttonSpacing||0);c.selected===b&&j[b].setState(2)}),o))c.div=m=aa("div",null,{position:"relative",height:0,zIndex:1}),f.parentNode.insertBefore(m,f),c.inputGroup=m=e.g("input-group").add(),m.offset=0,c.drawInput("min"),c.drawInput("max");o&&(f=d.plotTop-35,m.align(y({y:f,width:m.offset,x:h&&f<(h.y||0)+h.height-g.chart.spacingTop?-40:0},i.inputPosition),!0,d.spacingBox),c.setInputValue("min",a),c.setInputValue("max",
b));c.rendered=!0},destroy:function(){var a=this.minInput,b=this.maxInput,c=this.chart,d=this.blurInputs,e;X(c.container,"mousedown",d);X(c,"resize",d);Aa(this.buttons);if(a)a.onfocus=a.onblur=a.onchange=null;if(b)b.onfocus=b.onblur=b.onchange=null;for(e in this)this[e]&&e!=="chart"&&(this[e].destroy?this[e].destroy():this[e].nodeType&&Za(this[e])),this[e]=null}};sa(Sa.prototype,"init",function(a,b,c){F(this,"init",function(){if(this.options.rangeSelector.enabled)this.rangeSelector=new Jb(this)});
a.call(this,b,c)});Highcharts.RangeSelector=Jb;Sa.prototype.callbacks.push(function(a){function b(){f=a.xAxis[0].getExtremes();g.render(t(f.min,f.dataMin),A(f.max,p(f.dataMax,Number.MAX_VALUE)))}function c(){f=a.xAxis[0].getExtremes();h.render(f.min,f.max)}function d(a){g.render(a.min,a.max)}function e(a){h.render(a.min,a.max)}var f,g=a.scroller,h=a.rangeSelector;g&&(F(a.xAxis[0],"afterSetExtremes",d),sa(a,"drawChartBox",function(a){var c=this.isDirtyBox;a.call(this);c&&b()}),b());h&&(F(a.xAxis[0],
"afterSetExtremes",e),F(a,"resize",c),c());F(a,"destroy",function(){g&&X(a.xAxis[0],"afterSetExtremes",d);h&&(X(a,"resize",c),X(a.xAxis[0],"afterSetExtremes",e))})});Highcharts.StockChart=function(a,b){var c=a.series,d,e={marker:{enabled:!1,states:{hover:{radius:5}}},states:{hover:{lineWidth:2}}},f={shadow:!1,borderWidth:0};a.xAxis=Fa(ja(a.xAxis||{}),function(a){return z({minPadding:0,maxPadding:0,ordinal:!0,title:{text:null},labels:{overflow:"justify"},showLastLabel:!0},a,{type:"datetime",categories:null})});
a.yAxis=Fa(ja(a.yAxis||{}),function(a){d=a.opposite;return z({labels:{align:d?"right":"left",x:d?-2:2,y:-2},showLastLabel:!1,title:{text:null}},a)});a.series=null;a=z({chart:{panning:!0,pinchType:"x"},navigator:{enabled:!0},scrollbar:{enabled:!0},rangeSelector:{enabled:!0},title:{text:null},tooltip:{shared:!0,crosshairs:!0},legend:{enabled:!1},plotOptions:{line:e,spline:e,area:e,areaspline:e,arearange:e,areasplinerange:e,column:f,columnrange:f,candlestick:f,ohlc:f}},a,{_stock:!0,chart:{inverted:!1}});
a.series=c;return new Sa(a,b)};sa(pb.prototype,"init",function(a,b,c){var d=c.chart.pinchType||"";a.call(this,b,c);this.pinchX=this.pinchHor=d.indexOf("x")!==-1;this.pinchY=this.pinchVert=d.indexOf("y")!==-1});var kc=V.init,lc=V.processData,mc=Ha.prototype.tooltipFormatter;V.init=function(){kc.apply(this,arguments);this.setCompare(this.options.compare)};V.setCompare=function(a){this.modifyValue=a==="value"||a==="percent"?function(b,c){var d=this.compareValue,b=a==="value"?b-d:b=100*(b/d)-100;if(c)c.change=
b;return b}:null;if(this.chart.hasRendered)this.isDirty=!0};V.processData=function(){lc.apply(this,arguments);if(this.options.compare)for(var a=0,b=this.processedXData,c=this.processedYData,d=c.length,e=this.xAxis.getExtremes().min;a<d;a++)if(typeof c[a]==="number"&&b[a]>=e){this.compareValue=c[a];break}};Da.prototype.setCompare=function(a,b){this.isXAxis||(n(this.series,function(b){b.setCompare(a)}),p(b,!0)&&this.chart.redraw())};Ha.prototype.tooltipFormatter=function(a){a=a.replace("{point.change}",
(this.change>0?"+":"")+xa(this.change,this.series.tooltipOptions.changeDecimals||2));return mc.apply(this,[a])};(function(){var a=V.init,b=V.getSegments;V.init=function(){var b,d;a.apply(this,arguments);b=this.chart;(d=this.xAxis)&&d.options.ordinal&&F(this,"updatedData",function(){delete d.ordinalIndex});if(d&&d.options.ordinal&&!d.hasOrdinalExtension){d.hasOrdinalExtension=!0;d.beforeSetTickPositions=function(){var a,b=[],c=!1,e,j=this.getExtremes(),k=j.min,j=j.max,m;if(this.options.ordinal){n(this.series,
function(c,d){if(c.visible!==!1&&c.takeOrdinalPosition!==!1&&(b=b.concat(c.processedXData),a=b.length,b.sort(function(a,b){return a-b}),a))for(d=a-1;d--;)b[d]===b[d+1]&&b.splice(d,1)});a=b.length;if(a>2){e=b[1]-b[0];for(m=a-1;m--&&!c;)b[m+1]-b[m]!==e&&(c=!0)}c?(this.ordinalPositions=b,c=d.val2lin(k,!0),e=d.val2lin(j,!0),this.ordinalSlope=j=(j-k)/(e-c),this.ordinalOffset=k-c*j):this.ordinalPositions=this.ordinalSlope=this.ordinalOffset=w}};d.val2lin=function(a,b){var c=this.ordinalPositions;if(c){var d=
c.length,e,k;for(e=d;e--;)if(c[e]===a){k=e;break}for(e=d-1;e--;)if(a>c[e]||e===0){c=(a-c[e])/(c[e+1]-c[e]);k=e+c;break}return b?k:this.ordinalSlope*(k||0)+this.ordinalOffset}else return a};d.lin2val=function(a,b){var c=this.ordinalPositions;if(c){var d=this.ordinalSlope,e=this.ordinalOffset,k=c.length-1,m,l;if(b)a<0?a=c[0]:a>k?a=c[k]:(k=W(a),l=a-k);else for(;k--;)if(m=d*k+e,a>=m){d=d*(k+1)+e;l=(a-m)/(d-m);break}return l!==w&&c[k]!==w?c[k]+(l?l*(c[k+1]-c[k]):0):a}else return a};d.getExtendedPositions=
function(){var a=d.series[0].currentDataGrouping,e=d.ordinalIndex,h=a?a.count+a.unitName:"raw",i=d.getExtremes(),j,k;if(!e)e=d.ordinalIndex={};if(!e[h])j={series:[],getExtremes:function(){return{min:i.dataMin,max:i.dataMax}},options:{ordinal:!0}},n(d.series,function(d){k={xAxis:j,xData:d.xData,chart:b,destroyGroupedData:qa};k.options={dataGrouping:a?{enabled:!0,forced:!0,approximation:"open",units:[[a.unitName,[a.count]]]}:{enabled:!1}};d.processData.apply(k);j.series.push(k)}),d.beforeSetTickPositions.apply(j),
e[h]=j.ordinalPositions;return e[h]};d.getGroupIntervalFactor=function(a,b,c){for(var d=0,e=c.length,k=[];d<e-1;d++)k[d]=c[d+1]-c[d];k.sort(function(a,b){return a-b});d=k[W(e/2)];a=t(a,c[0]);b=A(b,c[e-1]);return e*d/(b-a)};d.postProcessTickInterval=function(a){var b=this.ordinalSlope;return b?a/(b/d.closestPointRange):a};d.getNonLinearTimeTicks=function(a,b,c,e,j,k,m){var l=0,n=0,p,r={},u,s,t,y=[],z=-Number.MAX_VALUE,A=d.options.tickPixelInterval;if(!j||j.length===1||b===w)return fb(a,b,c,e);for(s=
j.length;n<s;n++){t=n&&j[n-1]>c;j[n]<b&&(l=n);if(n===s-1||j[n+1]-j[n]>k*5||t){if(j[n]>z){for(p=fb(a,j[l],j[n],e);p.length&&p[0]<=z;)p.shift();p.length&&(z=p[p.length-1]);y=y.concat(p)}l=n+1}if(t)break}a=p.info;if(m&&a.unitRange<=I[za]){n=y.length-1;for(l=1;l<n;l++)(new Date(y[l]))[Oa]()!==(new Date(y[l-1]))[Oa]()&&(r[y[l]]=ga,u=!0);u&&(r[y[0]]=ga);a.higherRanks=r}y.info=a;if(m&&v(A)){var m=a=y.length,n=[],B;for(u=[];m--;)l=d.translate(y[m]),B&&(u[m]=B-l),n[m]=B=l;u.sort();u=u[W(u.length/2)];u<A*0.6&&
(u=null);m=y[a-1]>c?a-1:a;for(B=void 0;m--;)l=n[m],c=B-l,B&&c<A*0.8&&(u===null||c<u*0.8)?(r[y[m]]&&!r[y[m+1]]?(c=m+1,B=l):c=m,y.splice(c,1)):B=l}return y};var e=b.pan;b.pan=function(a){var d=b.xAxis[0],h=!1;if(d.options.ordinal&&d.series.length){var i=b.mouseDownX,j=d.getExtremes(),k=j.dataMax,m=j.min,l=j.max,o;o=b.hoverPoints;var p=d.closestPointRange,i=(i-a)/(d.translationSlope*(d.ordinalSlope||p)),r={ordinalPositions:d.getExtendedPositions()},u,p=d.lin2val,s=d.val2lin;if(r.ordinalPositions){if(U(i)>
1)o&&n(o,function(a){a.setState()}),i<0?(o=r,r=d.ordinalPositions?d:r):o=d.ordinalPositions?d:r,u=r.ordinalPositions,k>u[u.length-1]&&u.push(k),o=p.apply(o,[s.apply(o,[m,!0])+i,!0]),i=p.apply(r,[s.apply(r,[l,!0])+i,!0]),o>A(j.dataMin,m)&&i<t(k,l)&&d.setExtremes(o,i,!0,!1,{trigger:"pan"}),b.mouseDownX=a,L(b.container,{cursor:"move"})}else h=!0}else h=!0;h&&e.apply(b,arguments)}}};V.getSegments=function(){var a=this,d,e=a.options.gapSize;b.apply(a);if(e)d=a.segments,n(d,function(b,g){for(var h=b.length-
1;h--;)b[h+1].x-b[h].x>a.xAxis.closestPointRange*e&&d.splice(g+1,0,b.splice(h+1,b.length-h))})}})();y(Highcharts,{Axis:Da,Chart:Sa,Color:wa,Legend:Hb,Pointer:pb,Point:Ha,Tick:ab,Tooltip:Gb,Renderer:cb,Series:$,SVGElement:Ca,SVGRenderer:Ga,arrayMin:Pa,arrayMax:ua,charts:Ua,dateFormat:ya,format:La,pathAnim:Lb,getOptions:function(){return M},hasBidiBug:cc,isTouchDevice:ub,numberFormat:xa,seriesTypes:Q,setOptions:function(a){M=z(M,a);Tb();return M},addEvent:F,removeEvent:X,createElement:aa,discardElement:Za,
css:L,each:n,extend:y,map:Fa,merge:z,pick:p,splat:ja,extendClass:ea,pInt:C,wrap:sa,svg:ca,canvas:ia,vml:!ca&&!ia,product:"Highstock",version:"1.3.2"})})();
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//










