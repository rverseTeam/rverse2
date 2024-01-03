var Olv = Olv || {};
(function (jQuery, Olive) {
  Olive.init ||
    ((Olive.init = jQuery
      .Deferred(function () {
        jQuery(this.resolve);
      })
      .promise()),
    (Olive.Router = function () {
      (this.routes = []), (this.guard = jQuery.Deferred());
    }),
    jQuery.extend(Olive.Router.prototype, {
      connect: function (a, b) {
        a instanceof RegExp || (a = new RegExp(a)), this.routes.push([a, b]);
      },
      dispatch: function (b) {
        this.guard.resolve(b), (this.guard = jQuery.Deferred());
        for (var c, d = b.pathname, e = 0; (c = this.routes[e]); e++) {
          var f = d.match(c[0]);
          f && c[1].call(this, f, b, this.guard.promise());
        }
      },
    }),
    (Olive.router = new Olive.Router()),
    jQuery(document).on("pjax:end", function (c, d) {
      jQuery(document).trigger("olv:pagechange", [d]), Olive.router.dispatch(location);
    }),
    Olive.init.done(function () {
      Olive.router.dispatch(location);
    }),
    Olive.init.done(function () {
      var a = wiiuBOSS.isRegisteredDirectMessageTask();
      a &&
        a.isRegistered &&
        Olive.Utils.callWiiuBOSSFuncWithFallback("registerDirectMessageTaskEx");
    }),
    (Olive.Locale = {
      Data: {},
      text: function (a) {
        var c = Array.prototype.slice.call(arguments);
        return c.splice(1, 0, -1), Olive.Locale.textN.apply(this, c);
      },
      textN: function (a, c) {
        if (Olive.Cookie.get("plain_msgid")) return a;
        c = +c || 0;
        var d = Olive.Locale.Data[a];
        if (!d) return a;
        var e,
          f,
          g = d.quanttype || "o",
          h =
            ("1_o" === g && 1 === c) || ("01_o" === g && (0 === c || 1 === c));
        if (
          (h
            ? ((e = d.text_value_1 || d.value_1),
              (f = d.text_args_1 || d.args_1))
            : ((e = d.text_value || d.value), (f = d.text_args || d.args)),
          !f)
        )
          return e;
        var i = Array.prototype.slice.call(arguments, 2),
          j = 0;
        return e.replace(/%s/g, function () {
          return i[f[j++] - 1];
        });
      },
    }),
    (Olive.loc = Olive.Locale.text),
    (Olive.loc_n = Olive.Locale.textN),
    (Olive.print = function (a) {
      "undefined" != typeof wiiuDebug
        ? wiiuDebug.print(a)
        : "undefined" != typeof console && console.log(a);
    }),
    (Olive.alert = function (a, c) {
      Olive.Loading.isLocked() ||
        (arguments.length <= 1 && (c = Olive.loc("olv.portal.ok")),
        wiiuDialog.alert(a, c));
    }),
    (Olive.confirm = function (a, c, d) {
      return Olive.Loading.isLocked()
        ? void 0
        : (arguments.length <= 1 &&
            ((c = Olive.loc("olv.portal.cancel")), (d = Olive.loc("olv.portal.ok"))),
          wiiuDialog.confirm(a, c, d));
    }),
    (Olive.deferredAlert = function (c, d) {
      var e = arguments,
        f = jQuery.Deferred();
      return (
        setTimeout(function () {
          Olive.alert.apply(null, e), f.resolve();
        }, 0),
        f.promise()
      );
    }),
    (Olive.deferredConfirm = function (c, d, e) {
      var f = arguments,
        g = jQuery.Deferred();
      return (
        setTimeout(function () {
          var a = Olive.confirm.apply(null, f);
          g.resolve(a);
        }, 0),
        g.promise()
      );
    }),
    (Olive.Cookie = {
      set: function (a, b) {
        var c =
          encodeURIComponent(a) + "=" + encodeURIComponent(b) + "; path=/";
        document.cookie = c;
      },
      get: function (a) {
        if (!a || !document.cookie) return void 0;
        for (var b = document.cookie.split("; "), c = 0; c < b.length; c++) {
          var d = b[c].split("=");
          if (a === decodeURIComponent(d[0])) return decodeURIComponent(d[1]);
        }
        return void 0;
      },
    }),
    (Olive.Loading = {
      _showCount: 0,
      show: function (b) {
        this._showCount++ || wiiuBrowser.showLoadingIcon(!0),
          b.always(
            jQuery.proxy(function () {
              --this._showCount || wiiuBrowser.showLoadingIcon(!1);
            }, this)
          );
      },
      isShown: function () {
        return !!this._showCount;
      },
      _lockCount: 0,
      lock: function (b) {
        this._lockCount++ || wiiuBrowser.lockUserOperation(!0),
          b.always(
            jQuery.proxy(function () {
              --this._lockCount || wiiuBrowser.lockUserOperation(!1);
            }, this)
          );
      },
      isLocked: function () {
        return !!this._lockCount;
      },
      setup: function () {
        wiiuBrowser.showLoadingIcon(!1),
          wiiuBrowser.lockUserOperation(!1),
          Olive.Loading.lock(Olive.init),
          jQuery(document).on("pjax:send", function (a, c) {
            Olive.Loading.lock(c);
          });
      },
    }),
    Olive.Loading.setup(),
    (Olive.ErrorViewer = {
      open: function (a) {
        if (!Olive.Loading.isLocked()) {
          a = a || {};
          var c = +(a.error_code || a.code || 0),
            d = a.message || (a.msgid && Olive.loc(a.msgid));
          c || ((c = 1219999), (d = d || Olive.loc("olv.portal.error.500"))),
            d
              ? wiiuErrorViewer.openByCodeAndMessage(c, d)
              : wiiuErrorViewer.openByCode(c);
        }
      },
      deferredOpen: function (c) {
        var d = jQuery.Deferred();
        return (
          setTimeout(function () {
            Olive.ErrorViewer.open(c), d.resolve();
          }, 0),
          d.promise()
        );
      },
    }),
    (Olive.Net = {
      ajax: function (c) {
        var d = jQuery.ajax(c),
          e = Olive.Net._pageId,
          f = d.pipe(
            function (c, d, f) {
              var g = Olive.Net._pageId === e,
                h = (c && "object" == typeof c && !c.success) || !g,
                i = [c, d, f, g];
              return h
                ? jQuery.Deferred().rejectWith(this, i)
                : jQuery.Deferred().resolveWith(this, i);
            },
            function (c, d) {
              var f = Olive.Net.getDataFromXHR(c);
              void 0 === f && (f = c.responseText);
              var g = Olive.Net._pageId === e;
              return jQuery.Deferred().rejectWith(this, [f, d, c, g]);
            }
          );
        return (
          c.showLoading && Olive.Loading.show(f),
          c.lock && Olive.Loading.lock(f),
          c.silent || f.fail(Olive.Net.errorFeedbackHandler),
          f.promise(d),
          d
        );
      },
      _pageId: 1,
      onPageChange: function () {
        Olive.Net._pageId++;
      },
      getDataFromXHR: function (a) {
        var b = a.responseText,
          c = a.getResponseHeader("Content-Type");
        if (b && c && /^application\/json(?:;|$)/.test(c))
          try {
            return JSON.parse(b);
          } catch (d) {}
        return void 0;
      },
      getErrorFromXHR: function (a) {
        var c = Olive.Net.getDataFromXHR(a),
          d = c && c.errors && c.errors[0];
        if (d && "object" == typeof d) return d;
        var e = a.status;
        return e
          ? 503 == e
            ? {
                error_code: 1211503,
                message: Olive.loc("olv.portal.error.503.content"),
              }
            : 500 > e
            ? {
                error_code: 1210902,
                message: Olive.loc("olv.portal.error.failed_to_connect"),
              }
            : { error_code: 1219999, message: Olive.loc("olv.portal.error.500") }
          : {
              error_code: 1219998,
              message: Olive.loc("olv.portal.error.network_unavailable"),
            };
      },
      errorFeedbackHandler: function (c, d, e, f) {
        if ("abort" !== d && f && !Olive.Loading.isLocked()) {
          var g = Olive.Net.getErrorFromXHR(e);
          jQuery(document).trigger("olv:net:error", [g, d, e, f]),
            Olive.ErrorViewer.open(g);
        }
      },
      get: function (a, c, d, e) {
        return Olive.Net.ajax({
          type: "GET",
          url: a,
          data: c,
          success: d,
          dataType: e,
        });
      },
      post: function (a, c, d, e) {
        return Olive.Net.ajax({
          type: "POST",
          url: a,
          data: c,
          success: d,
          dataType: e,
        });
      },
    }),
    jQuery(document).on("olv:pagechange", Olive.Net.onPageChange),
    (Olive.Browsing = {
      setup: function () {
        jQuery.pjax &&
          ((jQuery.pjax.defaults.timeout = 0),
          (jQuery.pjax.defaults.maxCacheLength = 5),
          (jQuery.pjax.defaults.lockRequest = !0),
          jQuery(document).pjax("a[href][data-pjax]"),
          jQuery(document).on(
            "click",
            "[data-href][data-pjax]",
            this.onDataHrefClick
          ),
          jQuery(document).on("click", "a[href][data-replace]", this.onReplaceClick),
          jQuery(window).on("click", "a[href]", this.onLinkClickFinally),
          jQuery(document).on("pjax:error", this.onPjaxError),
          jQuery(document).on("olv:pagechange", this.onPageChange));
      },
      guardPage: function () {
        function b() {
          jQuery(window).off("pagehide", b),
            jQuery(document).off("olv:pagechange", b),
            c.resolve();
        }
        var c = jQuery.Deferred();
        return (
          jQuery(window).on("pagehide", b),
          jQuery(document).on("olv:pagechange", b),
          c.promise()
        );
      },
      lockPage: function () {
        var a = Olive.Browsing.guardPage();
        return Olive.Loading.lock(a), a;
      },
      replaceWith: function (a) {
        var c = Olive.Browsing.lockPage();
        return location.replace(a), c;
      },
      reload: function () {
        return jQuery.pjax
          ? jQuery.pjax.reload("#body").promise()
          : (location.reload(), Olive.Browsing.guardPage());
      },
      clearCache: function () {
        jQuery.pjax && jQuery.pjax.clearCache();
      },
      onDataHrefClick: function (b) {
        if (!b.isDefaultPrevented() && !jQuery(b.target).closest("a").length) {
          var c = jQuery(this);
          c.hasClass("disabled") ||
            (jQuery.pjax({
              url: c.attr("data-href"),
              container: c.attr("data-pjax"),
              target: c.get(0),
            }),
            b.preventDefault());
        }
      },
      onReplaceClick: function (c) {
        if (!c.isDefaultPrevented()) {
          c.preventDefault();
          var d = jQuery(this).attr("href");
          setTimeout(function () {
            Olive.Browsing.replaceWith(d);
          }, 0);
        }
      },
      onLinkClickFinally: function (a) {
        a.isDefaultPrevented() ||
          this.href.replace(/#.*/, "") === location.href.replace(/#.*/, "") ||
          Olive.Browsing.lockPage();
      },
      onPjaxError: function (c, d, e, f, g) {
        if ("abort" !== e) {
          if ((c.preventDefault(), d.getResponseHeader("X-PJAX-OK")))
            return void g.success(d.responseText, e, d);
          var h = Olive.Net.getErrorFromXHR(d);
          setTimeout(function () {
            jQuery(document).trigger("olv:browsing:error", [h, e, d, g]),
              Olive.ErrorViewer.open(h);
          }, 0),
            (g.revert = !0);
        }
      },
      revision: 1 / 0,
      expires: +new Date() + 864e5,
      onPageChange: function (a, c) {
        if (c) {
          var d = Olive.Browsing,
            e = +c.getResponseHeader("X-Browsing-Revision");
          (d.revision < e || d.expires < +new Date()) &&
            (Olive.Browsing.lockPage(), location.reload());
        }
      },
      setupAnchorLinkReplacer: function (b) {
        function c(b) {
          if (!b.isDefaultPrevented()) {
            var c = jQuery(this),
              d = c.attr("href") || "";
            /^#.+$/.test(d) &&
              (b.preventDefault(),
              setTimeout(function () {
                location.replace(d);
              }, 0));
          }
        }
        jQuery(document).on("click", "a[href]", c),
          b.done(function () {
            jQuery(document).off("click", "a[href]", c);
          });
      },
    }),
    Olive.init.done(function () {
      Olive.Browsing.setup();
    }),
    (Olive.Utils = {}),
    (Olive.Utils.containsNGWords = function (a) {
      return "undefined" == typeof wiiuFilter
        ? !1
        : wiiuFilter.checkWord(a) < 0;
    }),
    (Olive.Utils.ERROR_CONTAINS_NG_WORDS = {
      error_code: 1215901,
      msgid: "olv.portal.contains.ng_words",
    }),
    (Olive.Utils.callWiiuBOSSFuncWithFallback = function (a) {
      var b = wiiuBOSS[a];
      return "registerDirectMessageTaskEx" == a
        ? "function" != typeof b
          ? wiiuBOSS.registerDirectMessageTask()
          : b.call(wiiuBOSS, 720, 2)
        : b.call(wiiuBOSS);
    }),
    (Olive.Content = {}),
    (Olive.Content.autopagerize = function (c, d) {
      function e() {
        if (
          !(
            k._disabledCount ||
            h.scrollTop() + l + 200 < f.offset().top + f.outerHeight()
          )
        ) {
          var b = jQuery("<div/>")
            .attr("class", "post-list-loading")
            .append(
              jQuery("<img/>").attr({ src: "/img/loading-image-green.gif", alt: "" })
            )
            .appendTo(f);
          (i = jQuery
            .ajax({ url: g, headers: { "X-AUTOPAGERIZE": !0 } })
            .done(function (d) {
              var h = jQuery("<div>" + d + "</div>").find(c);
              (g = h.attr("data-next-page-url") || ""),
                g || j.resolve(),
                f.trigger("olv:autopagerize", [h, g, b]),
                h.children().each(function () {
                  this.id && jQuery("#" + this.id).length && jQuery(this).detach();
                }),
                f.attr("data-next-page-url", g),
                f.append(h.children()),
                g && setTimeout(e, 0);
            })
            .always(function () {
              b.remove(), (i = null);
            })),
            k.disable(i);
        }
      }
      var f = jQuery(c),
        g = f.attr("data-next-page-url");
      if (g) {
        var h = jQuery(window),
          i = null,
          j = jQuery.Deferred(),
          k = Olive.Content.autopagerize,
          l = h.height();
        h.on("scroll", e),
          j.done(function () {
            h.off("scroll", e), i && i.abort();
          }),
          setTimeout(e, 0),
          d.done(j.resolve);
      }
    }),
    (Olive.Content.autopagerize._disabledCount = 0),
    (Olive.Content.autopagerize.disable = function (a) {
      var c = Olive.Content.autopagerize;
      c._disabledCount++,
        a.always(function () {
          c._disabledCount--;
        });
    }),
    (Olive.Content.preloadImages = function () {
      for (var a = arguments.length, b = a; b--; ) {
        var c = document.createElement("img");
        c.src = arguments[b];
      }
    }),
    (Olive.Content.fixFixedPositionElement = function (b) {
      var c = jQuery(b).first(),
        d = c.offset(),
        e = jQuery(window);
      d &&
        (e.width() < d.left || e.height() < d.top) &&
        (c.css("display", "none"),
        setTimeout(function () {
          c.css("display", "");
        }, 0));
    }),
    (Olive.Form = {
      toggleDisabled: function (c, d) {
        var e = void 0 === d;
        return (
          c.each(function () {
            var c = jQuery(this),
              f = e ? !Olive.Form.hasBeenDisabled(c) : d;
            if ("undefined" != typeof this.form) c.prop("disabled", f);
            else {
              c.toggleClass("disabled", f);
              var g = f ? "href" : "data-disabled-href",
                h = f ? "data-disabled-href" : "href",
                i = c.attr(g);
              void 0 !== i && (c.removeAttr(g), c.attr(h, i));
            }
          }),
          c
        );
      },
      _beingDisabledNodes: [],
      _beingDisabledObjects: [],
      isDisabled: function (a) {
        return (
          Olive.Form.hasBeenDisabled(a) ||
          Olive.Form._beingDisabledNodes.indexOf(a[0]) >= 0
        );
      },
      hasBeenDisabled: function (a) {
        return a.length && "undefined" != typeof a[0].form
          ? a.prop("disabled")
          : a.hasClass("disabled");
      },
      disable: function (a, c) {
        return (
          Olive.Form.toggleDisabled(a, !0),
          c.always(function () {
            Olive.Form.toggleDisabled(a, !1);
          }),
          a
        );
      },
      disableSoon: function (a, c) {
        var d = Olive.Form;
        c.always(function () {
          d.toggleDisabled(a, !1);
        });
        var e = d._beingDisabledNodes,
          f = d._beingDisabledObjects;
        return (
          f.length ||
            setTimeout(function () {
              for (var a, b = 0; (a = f[b]); b++)
                "pending" === a[1].state() && d.toggleDisabled(a[0], !0);
              e.length = f.length = 0;
            }, 0),
          e.push.apply(e, a.get()),
          f.push([a, c]),
          a
        );
      },
      setupDisabledMessage: function (c) {
        function d(c) {
          var d = jQuery(this);
          if (Olive.Form.hasBeenDisabled(d)) {
            c.preventDefault();
            var e = d.attr("data-disabled-message");
            e && Olive.deferredAlert(e);
          }
        }
        jQuery(document).on("click", "[data-disabled-message]", d),
          c.done(function () {
            jQuery(document).off("click", "[data-disabled-message]", d);
          });
      },
      submit: function (b, c, d) {
        b.trigger("olv:form:submit", [c || jQuery()]);
        var e = b.serializeArray(),
          f = c && c.is("input, button") && c.prop("name");
        f && e.push({ name: f, value: c.val() });
        var g = {
          type: b.prop("method"),
          url: b.attr("action"),
          data: e,
          lock: d,
        };
        return this.send(g, c);
      },
      get: function (a, b, c, d) {
        var e = { type: "GET", url: a, data: b, lock: d };
        return this.send(e, c);
      },
      post: function (a, b, c, d) {
        var e = { type: "POST", url: a, data: b, lock: d };
        return this.send(e, c);
      },
      send: function (c, d) {
        var e = Olive.Net.ajax(c);
        return (
          jQuery(document).trigger("olv:form:send", [e, c, d || jQuery()]),
          d && Olive.Form.disableSoon(d, e),
          e
        );
      },
      updateParentClass: function (b) {
        switch (b.type) {
          case "radio":
            var c = jQuery(
              b.form ? b.form.elements[b.name] : 'input[name="' + b.name + '"]'
            );
            c.each(function () {
              jQuery(this).parent().toggleClass("checked", this.checked);
            });
            break;
          case "checkbox":
            jQuery(b).parent().toggleClass("checked", b.checked);
        }
      },
      setup: function () {
        jQuery(document).on("click", "input", function (a) {
          a.isDefaultPrevented() || Olive.Form.updateParentClass(this);
        });
        var c = { submit: !0, reset: !0, button: !0, image: !0, file: !0 };
        jQuery(document).on("keypress", "input", function (b) {
          13 !== b.which ||
            b.isDefaultPrevented() ||
            this.type in c ||
            !this.form ||
            jQuery(this.form).attr("data-allow-submission") ||
            b.preventDefault();
        }),
          jQuery(document).on("submit", function (b) {
            b.isDefaultPrevented() ||
              jQuery(b.target).attr("data-allow-submission") ||
              b.preventDefault();
          }),
          jQuery(document).on("olv:form:send", function (a, c, d) {
            "POST" === (d.type || "").toUpperCase() && Olive.Browsing.clearCache();
          });
      },
      setupForPage: function () {
        jQuery("input:checked").each(function () {
          Olive.Form.updateParentClass(this);
        });
      },
      syncSelectedText: function (a) {
        var b = a.find(":selected"),
          c = a.siblings(".select-button-content");
        c.text(b.text());
      },
    }),
    (Olive.Achievement = {
      requestAchieveWithoutRegard: function (b) {
        var c = jQuery.Deferred();
        return (
          this.requestAchieve(b).always(function () {
            c.resolveWith(this, arguments);
          }),
          c.promise()
        );
      },
      requestAchieve: function (a) {
        return Olive.Net.ajax({
          type: "POST",
          url: "/my/achievements.json",
          contentType: "application/json",
          data: JSON.stringify({ achievements: a }),
          silent: !0,
          lock: !0,
        });
      },
    }),
    Olive.init.done(Olive.Form.setup),
    Olive.router.connect("", Olive.Form.setupForPage),
    (Olive.DecreasingTimer = function (a, b, c) {
      (this.callback_ = a),
        (this.initialInterval_ = b || 1e4),
        (this.maxInterval_ = c || 1 / 0),
        (this.interval_ = this.initialInterval_),
        (this.timeouts_ = []);
    }),
    (Olive.DecreasingTimer.prototype.resetInterval = function () {
      (this.interval_ = this.initialInterval_),
        this.clearAllTimeouts(),
        this.invoke();
    }),
    (Olive.DecreasingTimer.prototype.clearAllTimeouts = function () {
      jQuery(this.timeouts_).each(
        jQuery.proxy(function (a, b) {
          this.clearTimeout(b);
        }, this)
      );
    }),
    (Olive.DecreasingTimer.prototype.clearTimeout = function (a) {
      for (var b = 0, c = this.timeouts_.length; c > b; ++b)
        if (this.timeouts_[b] == a) {
          clearTimeout(this.timeouts_[b]), this.timeouts_.splice(b, 1);
          break;
        }
    }),
    (Olive.DecreasingTimer.prototype.invoke = function () {
      this.callback_();
      var b;
      (b = setTimeout(
        jQuery.proxy(function () {
          this.invoke(), this.clearTimeout(b);
        }, this),
        this.interval_
      )),
        this.timeouts_.push(b),
        (this.interval_ = Math.min(
          Math.floor(1.5 * this.interval_),
          this.maxInterval_
        ));
    }),
    (Olive.UpdateChecker = function (a, c) {
      (this._settings = {}), Olive.DecreasingTimer.call(this, this.callback_, a, c);
    }),
    (Olive.UpdateChecker.prototype = new Olive.DecreasingTimer()),
    (Olive.UpdateChecker.getInstance = function () {
      return (
        void 0 == Olive.UpdateChecker.instance &&
          (Olive.UpdateChecker.instance = new Olive.UpdateChecker(1e4, 6e5)),
        Olive.UpdateChecker.instance
      );
    }),
    (Olive.UpdateChecker.prototype.callback_ = function () {
      var c = {};
      jQuery.each(
        this._settings,
        jQuery.proxy(function (b) {
          void 0 != this._settings[b].pathname &&
          this._settings[b].pathname != location.pathname
            ? delete this._settings[b]
            : jQuery.each(this._settings[b].params, function (a, b) {
                c[a] = JSON.stringify(b);
              });
        }, this)
      ),
        Olive.Net.ajax({ url: "/check_update.json", data: c, silent: !0 }).done(
          jQuery.proxy(function (b) {
            jQuery(this).triggerHandler("update", [b]);
          }, this)
        );
    }),
    (Olive.UpdateChecker.prototype.onUpdate = function (a, b, c, d) {
      (this._settings[a] = { params: b, update: c }),
        d && (this._settings[a].pathname = location.pathname);
    }),
    (Olive.UpdateChecker.prototype.deleteChecker = function (a) {
      delete this._settings[a];
    }),
    (Olive.Toggler = function (a, b) {
      (this.actions = a), (this.index = b || 0), (this.loading = null);
    }),
    jQuery.extend(Olive.Toggler.prototype, {
      toggle: function (c) {
        return this.loading ||
          (0 === arguments.length && (c = this.index + 1),
          (c %= this.actions.length) === this.index)
          ? void 0
          : ((this.loading = Olive.Form.send({
              type: "POST",
              url: this.actions[c],
              data: this.params(c),
              context: this,
            })
              .done(function () {
                (this.index = c),
                  jQuery(this).triggerHandler("toggledone", arguments);
              })
              .fail(function () {
                jQuery(this).triggerHandler("togglefail", arguments);
              })
              .always(function () {
                jQuery(this).triggerHandler("toggleend"), (this.loading = null);
              })),
            jQuery(this).triggerHandler("togglestart"),
            this.loading);
      },
      params: function (a) {
        return [];
      },
    }),
    (Olive.Storage = function (a, b) {
      (this.storage = a), (this.prefix = b ? b + "." : "");
    }),
    jQuery.extend(Olive.Storage.prototype, {
      get: function (a, b) {
        var c = this.storage.getItem(this.prefix + a),
          d = c && JSON.parse(c);
        return !d || (d[1] && d[1] < +new Date()) ? b : d[0];
      },
      set: function (a, b, c) {
        var d = c ? +new Date() + 1e3 * c : 0,
          e = JSON.stringify([b, d]);
        this.storage.setItem(this.prefix + a, e);
      },
      remove: function (a) {
        this.storage.removeItem(this.prefix + a);
      },
      removeAll: function () {
        for (var a = [], b = this.storage.length(), c = 0; b > c; c++) {
          var d = this.storage.key(c);
          d && 0 === d.indexOf(this.prefix) && a.push(d);
        }
        a.forEach(function (a) {
          this.storage.removeItem(a);
        }, this);
      },
      sweep: function () {
        for (
          var a = [],
            b = this.storage.length(),
            c = this.prefix.length,
            d = {},
            e = 0;
          b > e;
          e++
        ) {
          var f = this.storage.key(e),
            g =
              f && 0 === f.indexOf(this.prefix) && this.get(f.substring(c), d);
          g === d && a.push(f);
        }
        a.forEach(function (a) {
          this.storage.removeItem(a);
        }, this);
      },
      save: function () {
        this.sweep(),
          "undefined" != typeof this.storage.write && this.storage.write();
      },
      getBranch: function (a) {
        return new this.constructor(this.storage, this.prefix + a);
      },
    }),
    jQuery.extend(Olive.Storage, {
      _session: null,
      session: function () {
        var a = Olive.Storage;
        return a._session || (a._session = new a(wiiuSessionStorage, "olv"));
      },
      _local: null,
      local: function () {
        var a = Olive.Storage;
        return a._local || (a._local = new a(wiiuLocalStorage, "olv"));
      },
    }),
    (Olive.KEY_LABEL_MAP = {
      13: "A",
      27: "B",
      88: "X",
      89: "Y",
      76: "L",
      82: "R",
      80: "plus",
      77: "minus",
    }),
    (Olive.KeyLocker = {
      locks: null,
      isLocked: function (a) {
        return !!this.locks[a];
      },
      onKeyDown: function (a) {
        a.which in this.locks && (this.locks[a.which] = !1);
      },
      onKeyPress: function (a) {
        a.which in this.locks &&
          (this.locks[a.which]
            ? a.preventDefault()
            : (this.locks[a.which] = !0));
      },
      onKeyUp: function (a) {
        a.which in this.locks &&
          ((this.locks[a.which] = !1), 32 === a.which && (this.locks[13] = !0));
      },
      setup: function () {
        var c = this,
          d = { 32: !1 };
        jQuery.each(Olive.KEY_LABEL_MAP, function (a) {
          d[a] = !1;
        }),
          (c.locks = d),
          jQuery(document).on({
            keydown: function (a) {
              c.onKeyDown(a);
            },
            keypress: function (a) {
              c.onKeyPress(a);
            },
            keyup: function (a) {
              c.onKeyUp(a);
            },
          });
      },
    }),
    Olive.init.done(function () {
      Olive.KeyLocker.setup();
    }),
    (Olive.TriggerHandler = {
      onKeyPress: function (c) {
        13 !== c.which ||
          c.isDefaultPrevented() ||
          Olive.KeyLocker.isLocked(13) ||
          (c.preventDefault(), jQuery(this).click());
      },
      onMouseUp: function (a) {
        this.blur();
      },
      setup: function () {
        jQuery(document).on(
          { keypress: this.onKeyPress, mouseup: this.onMouseUp },
          ".trigger"
        );
      },
    }),
    Olive.init.done(function () {
      Olive.TriggerHandler.setup();
    }),
    (Olive.AccessKey = {
      triggerByKey: function (c) {
        var d = null;
        if (
          (jQuery(".accesskey-" + c).each(function () {
            var c = jQuery(this);
            return Olive.Form.isDisabled(c) || c.closest(".none").length
              ? !0
              : ((d = c), !1);
          }),
          !d)
        )
          return null;
        d.click();
        var e = d.attr("href");
        return (
          e &&
            d.attr("data-is-standard-link") &&
            setTimeout(function () {
              location.href = e;
            }, 0),
          d
        );
      },
      onKeyPress: function (a) {
        if (13 !== a.which && !a.isDefaultPrevented()) {
          var c = Olive.KEY_LABEL_MAP[a.which];
          if (c) {
            var d = this.triggerByKey(c);
            d && a.preventDefault();
          }
        }
      },
      bind: function (b, c, d) {
        var e = jQuery("<button/>")
          .attr("type", "button")
          .addClass("accesskey-" + b)
          .on("click", c)
          .hide()
          .appendTo(document.body);
        return (
          d.always(function () {
            e.remove();
          }),
          e
        );
      },
      setup: function () {
        jQuery(document).on("keypress", jQuery.proxy(this.onKeyPress, this));
      },
    }),
    Olive.init.done(function () {
      Olive.AccessKey.setup();
    }),
    (Olive.Sound = {
      attentionSelector:
        "a[href], [data-href], input, textarea, select, button, label, .trigger, [data-sound]",
      isAttentionTarget: function (a) {
        return !!a.closest(this.attentionSelector).length;
      },
      playAttentionSound: function (a) {
        Olive.Form.hasBeenDisabled(a) ||
          wiiuSound.playSoundByName("SE_WAVE_DRC_TOUCH_TRG", 1);
      },
      activationSelector:
        'a[href], [data-href], input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], button, .trigger, [data-sound]',
      defaultActivationSound: "SE_WAVE_OK",
      setDefaultActivationSoundByPath: function (a) {
        this.defaultActivationSound = /^\/(?:help\/.|guide\/)/.test(a)
          ? "SE_WAVE_OK_SUB"
          : "SE_WAVE_OK";
      },
      playActivationSound: function (a) {
        if (!Olive.Form.hasBeenDisabled(a)) {
          var c = a.attr("data-sound");
          "" !== c &&
            wiiuSound.playSoundByName(c || this.defaultActivationSound, 1);
        }
      },
      playBGM: function (a) {
        wiiuSound.playSoundByName(a, 3);
      },
      playBGMByPath: function (a) {
        var b = /^\/welcome\//.test(a)
          ? "BGM_OLV_INIT"
          : /^\/(?:settings(?:\/|$)|help\/|guide\/)/.test(a)
          ? "BGM_OLV_SETTING"
          : "BGM_OLV_MAIN";
        this.playBGM(b);
      },
      setup: function () {
        jQuery(document).on("touchstart", this.attentionSelector, function () {
          Olive.Sound.playAttentionSound(jQuery(this));
        }),
          jQuery(document).on("click", this.activationSelector, function () {
            Olive.Sound.playActivationSound(jQuery(this));
          });
      },
    }),
    Olive.init.done(function () {
      Olive.Sound.setup();
    }),
    Olive.router.connect(/^/, function (a, c, d) {
      Olive.Sound.setDefaultActivationSoundByPath(c.pathname),
        Olive.Sound.playBGMByPath(c.pathname);
    }),
    (Olive.Dropdown = function (b) {
      (b = jQuery(b)),
        (this.container = b.parent()),
        (this.element = this.container.find(".dropdown-menu")),
        (this.triggerElement = b),
        (this.guard = null);
    }),
    jQuery.extend(Olive.Dropdown.prototype, {
      open: function () {
        function c(c) {
          g.guard &&
            (!g.element.attr("data-sticky") ||
              (g.element[0] !== c.target &&
                !jQuery.contains(g.element[0], c.target))) &&
            (Olive.Sound.isAttentionTarget(jQuery(c.target)) ||
              Olive.Sound.playActivationSound(g.triggerElement),
            g.close());
        }
        function d() {
          g.guard && (Olive.Sound.playActivationSound(g.triggerElement), g.close());
        }
        function e() {
          g.triggerElement.attr("data-sound", "SE_WAVE_BALLOON_CLOSE"),
            jQuery(document).on("click", c),
            jQuery(window).on("scroll", d);
        }
        function f() {
          g.triggerElement.attr("data-sound", "SE_WAVE_BALLOON_OPEN"),
            jQuery(document).off("click", c),
            jQuery(window).off("scroll", d);
        }
        if (!this.guard) {
          Olive.Dropdown.register(this),
            this.container.addClass("open"),
            this.triggerElement.addClass("dropdown-open");
          var g = this,
            h = (this.guard = jQuery.Deferred());
          setTimeout(function () {
            e(), h.done(f);
          }, 0),
            this.element.trigger("olv:dropdown", [this, h.promise()]);
        }
      },
      close: function () {
        this.guard &&
          (this.guard.resolve(),
          (this.guard = null),
          Olive.Dropdown.unregister(this),
          this.container.removeClass("open"),
          this.triggerElement.removeClass("dropdown-open"));
      },
    }),
    jQuery.extend(Olive.Dropdown, {
      current: null,
      register: function (a) {
        this.current && this.current.close(), (this.current = a);
      },
      unregister: function (a) {
        if (this.current !== a)
          throw new Error("Failed to unregister dropdown");
        this.current = null;
      },
      setup: function () {
        jQuery(document).on("click", '[data-toggle="dropdown"]', function (c) {
          if (!c.isDefaultPrevented()) {
            c.preventDefault();
            var d = jQuery(this);
            if (!Olive.Form.isDisabled(d) && !d.hasClass("dropdown-open")) {
              var e = new Olive.Dropdown(d);
              e.open();
            }
          }
        });
      },
    }),
    Olive.init.done(function () {
      Olive.Dropdown.setup();
    }),
    (Olive.ModalWindowManager = {}),
    (Olive.ModalWindowManager._windows = []),
    (Olive.ModalWindowManager.currentWindow = null),
    (Olive.ModalWindowManager.closeAll = function () {
      for (; this.currentWindow; ) this.currentWindow.close();
    }),
    (Olive.ModalWindowManager.closeUntil = function (a) {
      if (a.guard)
        for (var b; (b = this.currentWindow) && (b.close(), b !== a); );
    }),
    (Olive.ModalWindowManager.register = function (a) {
      this._windows.push(a), (this.currentWindow = a);
    }),
    (Olive.ModalWindowManager.unregister = function (a) {
      if (this.currentWindow !== a)
        throw new Error("Failed to unregister modal window");
      this._windows.pop();
      var b = this._windows.length;
      this.currentWindow = b ? this._windows[b - 1] : null;
    }),
    (Olive.ModalWindowManager.setup = function () {
      jQuery(document).on("click", "[data-modal-open]", function (c) {
        var d = jQuery(this);
        if (!Olive.Form.isDisabled(d) && !c.isDefaultPrevented()) {
          c.preventDefault();
          var e = jQuery.Event("olv:modalopen");
          if ((d.trigger(e), !e.isDefaultPrevented())) {
            var f = Olive.ModalWindowManager.createNewModal(this);
            f.open();
          }
        }
      }),
        jQuery(document).on("click", ".olv-modal-close-button", function (a) {
          if (!a.isDefaultPrevented()) {
            a.preventDefault();
            var c = Olive.ModalWindowManager.currentWindow;
            c && c.close();
          }
        }),
        jQuery(document).on("olv:modal", function (a, c, d) {
          Olive.Content.autopagerize.disable(d);
        });
    }),
    (Olive.ModalWindowManager.createNewModal = function (c) {
      var d = jQuery(c),
        e = jQuery(d.attr("data-modal-open"));
      e.attr("data-is-template") && (e = e.clone().removeAttr("id"));
      var f = new Olive.ModalWindow(e, c);
      return f;
    }),
    (Olive.ModalWindowManager.setupWindowPage = function (c) {
      if (!this.currentWindow) {
        var d = jQuery(".modal-window-open");
        if (d.length) {
          var e = new Olive.ModalWindow(d.first());
          e.triggerOpenHandlers(c);
        }
      }
    }),
    Olive.init.done(function () {
      Olive.ModalWindowManager.setup();
    }),
    Olive.router.connect(/^/, function (a, c, d) {
      Olive.ModalWindowManager.setupWindowPage(d);
    }),
    jQuery(document).on("olv:pagechange", function () {
      Olive.ModalWindowManager.closeAll();
    }),
    (Olive.ModalWindow = function (b, c) {
      (this.element = jQuery(b)),
        (this.triggerElement = jQuery(c)),
        (this.temporary = !this.element.parent().length),
        (this.prevScroll = 0),
        (this.prevContent = jQuery());
      var d = jQuery.trim(this.element.attr("data-modal-types"));
      (this.types = d ? d.split(/\s+/) : []), (this.guard = null);
    }),
    (Olive.ModalWindow.prototype.open = function () {
      return this.guard
        ? void 0
        : (document.activeElement.blur(),
          Olive.ModalWindowManager.register(this),
          (this.prevScroll = window.scrollY),
          this.temporary && this.element.appendTo("#body"),
          this.element
            .css({ position: "absolute", left: 0, top: 0 })
            .addClass("modal-window-open")
            .removeClass("none"),
          (this.prevContent = this.element
            .parentsUntil(document.body)
            .andSelf()
            .siblings()
            .filter(function () {
              return !jQuery(this).hasClass("none");
            })
            .addClass("none")),
          window.scrollTo(0, 0),
          this.triggerOpenHandlers(jQuery.Deferred()),
          this);
    }),
    (Olive.ModalWindow.prototype.triggerOpenHandlers = function (a) {
      this.guard = a;
      for (var b, c = [this, a.promise()], d = 0; (b = this.types[d]); d++)
        this.element.trigger("olv:modal:" + b, c);
      this.element.trigger("olv:modal", c);
    }),
    (Olive.ModalWindow.prototype.close = function () {
      return this.guard
        ? (this.guard.resolve(),
          (this.guard = null),
          Olive.ModalWindowManager.unregister(this),
          this.element.trigger("olv:modalclose"),
          this.temporary && this.element.remove(),
          this.element.addClass("none").removeClass("modal-window-open"),
          this.prevContent.removeClass("none"),
          window.scrollTo(0, this.prevScroll),
          (this.prevContent = jQuery()),
          (this.prevScroll = 0),
          this)
        : void 0;
    }),
    (Olive.ConfirmDialog = function (c) {
      c = c || {};
      var d = jQuery(c.template || "#confirm-dialog-template")
        .clone()
        .attr("id", "olvdialog" + new Date().getTime())
        .attr("data-modal-types", c.modalTypes || "confirm-dialog");
      Olive.ModalWindow.call(this, d, c.triggerElement),
        d.find(".ok-button").on(
          "click",
          jQuery.proxy(function (b) {
            jQuery(this).triggerHandler("dialogok", b), b.preventDefault();
          }, this)
        ),
        d.find(".cancel-button").on(
          "click",
          jQuery.proxy(function (b) {
            jQuery(this).triggerHandler("dialogcancel", b),
              this.close(),
              b.preventDefault();
          }, this)
        ),
        this.title(c.title)
          .body(c.body)
          .setButtonLabels({ ok: c.okLabel, cancel: c.cancelLabel });
    }),
    jQuery.extend(Olive.ConfirmDialog.prototype, Olive.ModalWindow.prototype, {
      title: function (a) {
        var b = this.element.find(".window-title");
        return "undefined" == typeof a ? b.text() : (b.text(a), this);
      },
      htmlLineBreak: function (a) {
        var b = { "<": "&lt;", ">": "&gt", "&": "&amp;", '"': "&quot" };
        return a
          .replace(/[<>&\"]/g, function (a) {
            return b[a];
          })
          .replace(/\n|\r\n?/g, function (a) {
            return "<br>" + a;
          });
      },
      body: function (a) {
        var b = this.element.find(".window-body .message p");
        return "undefined" == typeof a
          ? b.text()
          : (b.html(this.htmlLineBreak(a)), this);
      },
      setButtonLabels: function (a) {
        return (
          a.ok && this.element.find(".ok-button").text(a.ok),
          a.cancel && this.element.find(".cancel-button").text(a.cancel),
          this
        );
      },
      ok: function (b) {
        return jQuery(this).on("dialogok", b), this;
      },
      cancel: function (b) {
        return jQuery(this).on("dialogcancel", b), this;
      },
    }),
    (Olive.showConfirm = function (c, d, e) {
      return new Olive.ConfirmDialog(jQuery.extend({ title: c, body: d }, e)).open();
    }),
    (Olive.MessageDialog = function (c) {
      Olive.ConfirmDialog.call(
        this,
        jQuery.extend(c, { template: "#message-dialog-template" })
      ),
        jQuery(this.element).on(
          "click",
          ".single-button .button",
          jQuery.proxy(function (a) {
            this.close();
          }, this)
        );
    }),
    jQuery.extend(Olive.MessageDialog.prototype, Olive.ConfirmDialog.prototype),
    (Olive.showMessage = function (c, d, e) {
      return new Olive.MessageDialog(jQuery.extend({ title: c, body: d }, e)).open();
    }),
    Olive.router.connect("", function () {
      jQuery("#global-menu li").removeClass("selected");
    }),
    jQuery([
      [
        "^(/my_menu|/settings|/my_communities|/my_blacklist|/welcome/profile)",
        "#global-menu-mymenu",
      ],
      ["^/$", "#global-menu-feed"],
      ["^/titles(?:/|$)", "#global-menu-community"],
      ["^/communities(?:/|$)", "#global-menu-community"],
      ["^/(?:friend_messages(?:/|$)|admin_messages$)", "#global-menu-message"],
      ["^/news/", "#global-menu-news"],
    ]).each(function (c, d) {
      Olive.router.connect(d[0], function () {
        jQuery(d[1]).addClass("selected");
      });
    }),
    Olive.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+(?:/posts|/diary|/empathies|/friends|/followers|/following)?$",
      function () {
        var b = new RegExp(
          "^" +
            jQuery("body").attr("data-profile-url") +
            "(?:/posts|/diary|/empathies|/friends|/followers|/following)?$"
        );
        b.test(location.pathname) &&
          jQuery("#global-menu-mymenu").addClass("selected");
      }
    ),
    Olive.init.done(function (a) {
      function c() {
        var b = a("body").attr("data-profile-url"),
          c = new RegExp(
            "^(?:/|/communities|/friend_messages|/news/.+?|" +
              b +
              "|/welcome/profile)$"
          ),
          f = wiiuBrowser.canHistoryBack() && !c.test(location.pathname);
        d.toggleClass("none", f), e.toggleClass("none", !f);
      }
      var d = a("#global-menu-exit"),
        e = a("#global-menu-back");
      d.on("click", function (a) {
        a.preventDefault(),
          setTimeout(function () {
            wiiuBrowser.closeApplication();
          }, 0);
      }),
        e.on("click", function (a) {
          a.preventDefault(), history.back();
        }),
        Olive.router.connect(/^/, c),
        c();
    }),
    Olive.init.done(function (a) {
      if (a("#global-menu-news").length) {
        a("#global-menu-news").on("click", function (b) {
          a(b.currentTarget).find(".badge").hide();
        });
        var c = Olive.UpdateChecker.getInstance();
        a(c).on("update", function (b, d) {
          a.each(c._settings, function (b, c) {
            var e = !0;
            a.each(c.params, function (a, b) {
              void 0 === d[a] && (this.success = !1);
            }),
              e && c.update.call(void 0, d, c.params);
          });
        }),
          c.onUpdate(
            "check_update",
            { news: {}, admin_message: {}, mission: {} },
            function (b, c) {
              var d = a("#global-menu-news"),
                e = d.find(".badge");
              0 === e.length &&
                ((e = a('<span class="badge">')),
                e.hide().appendTo(d.find("a")));
              var f = 0;
              a.each(c, function (a, c) {
                f += Number(b[a].unread_count);
              }),
                e.text(f),
                e.toggle(f > 0);
            }
          ),
          c.onUpdate("message", { message: {} }, function (b, c) {
            var d = a("#global-menu-message"),
              e = d.find(".badge");
            0 === e.length &&
              ((e = a('<span class="badge">')), e.hide().appendTo(d.find("a"))),
              e.text(b.message.unread_count),
              e.toggle(b.message.unread_count > 0);
          }),
          a("body").on("pjax:complete", function (a) {
            c.resetInterval();
          }),
          c.invoke();
      }
    }),
    jQuery(document).on("click", ".tab-button", function (c) {
      var d = jQuery(this);
      Olive.Form.isDisabled(d) ||
        d
          .addClass("selected")
          .removeClass("notify")
          .siblings()
          .removeClass("selected");
    }),
    Olive.init.done(function (a) {
      var c;
      try {
        c = wiiuPDM.getTitlesFilteredByPlayTime("1").IDs;
      } catch (d) {
        try {
          c = wiiuPDM.getTitlesFilteredByPlayTime(1).IDs;
        } catch (d) {}
      }
      c || (c = []),
        Olive.Net.ajax({
          type: "POST",
          url: "/settings/played_title_ids",
          data: c.map(function (a) {
            return { name: "title_id_hex", value: a };
          }),
          silent: !0,
        });
    }),
    Olive.router.connect("", function (c, d, e) {
      function f(a) {
        var c = j.scrollTop() > m;
        c !== l &&
          (k.stop().fadeToggle(a ? 0 : 300),
          Olive.Form.toggleDisabled(k, !c),
          (l = c));
      }
      function g(a) {
        n || f();
      }
      function h(a) {
        Olive.Form.isDisabled(k) ||
          a.isDefaultPrevented() ||
          (a.preventDefault(), j.scrollTop(0));
      }
      function i(a, b, c) {
        n++,
          c.done(function () {
            n--;
          });
      }
      var j = jQuery(window),
        k = jQuery("#scroll-to-top");
      if (k.length) {
        var l = !1,
          m = 500,
          n = 0;
        f(!0),
          j.on("scroll", g),
          k.on("click", h),
          jQuery(document).on("olv:modal", i),
          e.done(function () {
            k.stop(!0, !0).hide(),
              j.off("scroll", g),
              k.off("click", h),
              jQuery(document).off("olv:modal", i);
          });
      }
    }),
    Olive.router.connect("", function (c, d, e) {
      var f = function (b) {
        var c,
          d = jQuery("#body .scroll").filter(":visible"),
          e = jQuery(document.activeElement),
          f = e.closest(".scroll").filter(":visible");
        if (f.length > 0) {
          var g = d.index(f),
            h = b ? g - 1 : g + 1;
          h >= 0 && h < d.length && (c = jQuery(d.get(h)));
        } else {
          var i = jQuery(document).scrollTop();
          i >= document.body.scrollHeight - jQuery(window).height()
            ? (c = b && d.length > 0 ? d.last() : null)
            : d.each(function () {
                var d = jQuery(this),
                  e = d.offset().top,
                  f = e - i;
                if (b) {
                  if (f >= 0) return !1;
                  c = d;
                } else if (f > 0) return (c = d), !1;
              });
        }
        var j;
        if (
          ((j = c ? c.offset().top : b ? 0 : document.body.scrollHeight),
          window.scrollTo(0, j),
          c)
        ) {
          var k =
            "a" === c[0].nodeName.toLowerCase()
              ? c
              : c.find(".scroll-focus").first();
          k.focus(), c.trigger("olv:keyhandler:scroll:element");
        } else e.blur(), jQuery(document).trigger("olv:keyhandler:scroll:document");
      };
      Olive.AccessKey.bind(
        "L",
        function () {
          f(!0);
        },
        e
      ),
        Olive.AccessKey.bind(
          "R",
          function () {
            f(!1);
          },
          e
        );
    }),
    (Olive.Content.setupReloadKey = function (a) {
      Olive.AccessKey.bind(
        "Y",
        function () {
          Olive.Browsing.reload();
        },
        a
      );
    }),
    (Olive.Tutorial = {}),
    (Olive.Tutorial.setupCloseButtons = function (c) {
      function d(c) {
        var d = jQuery(c.target);
        if ((d.parent().hide(), d.attr("data-tutorial-name")))
          jQuery.post("/settings/tutorial_post", {
            tutorial_name: d.attr("data-tutorial-name"),
          }).success(function () {});
        else if (d.attr("data-achievement-name")) {
          var e = d.attr("data-achievement-name").split(/\s*,\s*/);
          Olive.Achievement.requestAchieveWithoutRegard(e);
        }
        return c.preventDefault();
      }
      jQuery(document).on("click", ".tutorial-close-button", d),
        c.done(function () {
          jQuery(document).off("click", ".tutorial-close-button", d);
        });
    }),
    (Olive.Tutorial.setupBalloon = function (b, c) {
      function d(a) {
        return function (b) {
          a.hide();
        };
      }
      function e(c) {
        c.preventDefault();
        var d = jQuery(c.target).closest(b),
          e = d.attr("data-balloon-target");
        if (e) {
          var f = jQuery(e);
          f.length && f.trigger(c.type);
        }
      }
      for (var f = jQuery(b), g = [], h = 0, i = f.length; i > h; h++) {
        var j = f.eq(h);
        if (j.attr("data-balloon-target")) {
          var k = j.attr("data-balloon-target");
          g.push([k, d(j)]);
        }
      }
      for (jQuery(document).on("click", b, e), h = 0, i = g.length; i > h; h++)
        jQuery(document).on("click", g[h][0], g[h][1]);
      c.done(function () {
        jQuery(document).off("click", b, e);
        for (var c = 0, d = g.length; d > c; c++)
          jQuery(document).off("click", g[c][0], g[c][1]);
      });
    }),
    (Olive.Community = {}),
    (Olive.Community.setupInfoTicker = function (c) {
      function d(d) {
        var h = jQuery(this);
        Olive.Form.isDisabled(h) ||
          d.isDefaultPrevented() ||
          (h.attr("data-pjax")
            ? c.done(function () {
                e.remove();
              })
            : (d.preventDefault(), e.remove()),
          f.set(g, Math.floor(+new Date() / 1e3)),
          f.save(),
          e.attr("data-is-of-miiverse") &&
            jQuery.post("/settings/miiverse_info_post"));
      }
      var e = jQuery(".info-ticker");
      if (e.length) {
        var f = Olive.Storage.local().getBranch("community.info-ticker"),
          g = "last-seen." + e.attr("data-olive-title-id"),
          h = f.get(g) || 0,
          i = +e.attr("data-last-seen") || 0;
        i > h && ((h = i), f.set(g, h), f.save());
        var j = +e.attr("data-last-posted");
        if (!(j > h)) return void e.remove();
        e.removeClass("none"),
          e.on("click", "a[href]", d),
          c.done(function () {
            e.off("click", "a[href]", d);
          });
      }
    }),
    (Olive.Community.setupFavoriteButtons = function (c) {
      function d(c) {
        var d = jQuery(this);
        if (!Olive.Form.isDisabled(d) && !c.isDefaultPrevented()) {
          c.preventDefault();
          var e = d.hasClass("checked");
          d.toggleClass("checked"),
            jQuery(document.body).attr("data-is-first-favorite") &&
              !e &&
              Olive
                .deferredAlert(Olive.loc("olv.portal.confirm_first_favorite"))
                .done(function () {
                  jQuery(document.body).removeAttr("data-is-first-favorite");
                });
          var f = d.attr(e ? "data-action-unfavorite" : "data-action-favorite");
          Olive.Form.post(f, null, d)
            .done(function () {
              (e = !e),
                d.attr(
                  "data-sound",
                  e ? "SE_WAVE_CHECKBOX_UNCHECK" : "SE_WAVE_CHECKBOX_CHECK"
                ),
                d.trigger("olv:community:favorite:toggle", [e]);
            })
            .fail(function () {
              d.toggleClass("checked", e);
            });
        }
      }
      jQuery(document).on("click", ".favorite-button", d),
        c.done(function () {
          jQuery(document).off("click", ".favorite-button", d);
        });
    }),
    (Olive.Community.setupUnfavoriteButtons = function (c) {
      function d(c) {
        var d = jQuery(this);
        Olive.Form.isDisabled(d) ||
          (Olive.Form.post(d.attr("data-action"), null, d).done(function () {
            Olive.deferredAlert(Olive.loc("olv.portal.unfavorite_succeeded_to")),
              d.add(d.prev()).remove();
          }),
          c.preventDefault());
      }
      jQuery(document).on("click", ".unfavorite-button", d),
        c.done(function () {
          jQuery(document).off("click", ".unfavorite-button", d);
        });
    }),
    (Olive.Community.setupAppJumpButtons = function (c) {
      function d(c) {
        if (wiiuDevice.existsTitle) {
          for (
            var d,
              e = jQuery(this),
              f = e.attr("data-app-jump-title-ids").split(","),
              g = 0;
            g < f.length;
            g++
          )
            if (wiiuDevice.existsTitle(f[g])) {
              d = f[g];
              break;
            }
          d
            ? Olive
                .deferredConfirm(Olive.loc("olv.portal.confirm_app_jump"))
                .done(function (a) {
                  if (a) {
                    var b = d,
                      c = 1,
                      f = +e.attr("data-nex-community-id"),
                      g = e.attr("data-app-data");
                    wiiuBrowser.jumpToApplication(b, c, f || -1, g || "", "");
                  }
                })
            : Olive.deferredAlert(Olive.loc("olv.portal.confirm_you_have_no_soft"));
        }
      }
      jQuery(document).on("click", ".app-jump-button", d),
        c.done(function () {
          jQuery(document).off("click", ".app-jump-button", d);
        });
    }),
    (Olive.Community.setupShopButtons = function (c) {
      function d(c) {
        var d = jQuery(this);
        Olive.Form.isDisabled(d) ||
          c.isDefaultPrevented() ||
          (c.preventDefault(),
          Olive
            .deferredConfirm(Olive.loc("olv.portal.confirm_open_eshop"))
            .done(function (b) {
              if (b) {
                var c = {
                  version: "1.0.0",
                  scene: "detail",
                  dst_title_id: d.attr("data-dst-title-id"),
                  src_title_id: d.attr("data-src-title-id"),
                };
                jQuery(document).trigger("olv:jump:eshop", [c]);
                var e = jQuery.param(c);
                wiiuBrowser.jumpToEshop(e);
              }
            }));
      }
      jQuery(document).on("click", ".eshop-button", d),
        c.done(function () {
          jQuery(document).off("click", ".eshop-button", d);
        });
    }),
    (Olive.Community.setupPostButton = function (b) {
      function c() {
        return (
          "1" === jQuery(".tab-button.selected").attr("data-show-post-button") ||
          "1" === jQuery(".post-headline").attr("data-show-post-button")
        );
      }
      function d() {
        var b = c();
        jQuery("#header-post-button").toggleClass("none", !b);
      }
      d();
    }),
    (Olive.Community.setupURLSelector = function (b, c) {
      function d(b) {
        var c = e.val();
        c && jQuery.pjax({ url: c, container: "#body" });
      }
      var e = jQuery(b);
      e.on("change", d),
        c.done(function () {
          e.off("change", d);
        });
    }),
    (Olive.Community.setupSelectButton = function (c, d) {
      function e(a) {
        Olive.Form.syncSelectedText(f);
      }
      var f = jQuery(c);
      f.on("change", e),
        d.done(function () {
          f.off("change", e);
        });
    }),
    (Olive.Community.setupTopicPostButton = function (c) {
      function d(c) {
        var d = jQuery(this);
        Olive.Form.isDisabled(d) ||
          c.isDefaultPrevented() ||
          (c.preventDefault(),
          jQuery(".multi_timeline-topic-filter").addClass("open"));
      }
      jQuery(document).on("click", ".js-topic_post-header-post-button", d),
        c.done(function () {
          jQuery(document).off("click", ".js-topic_post-header-post-button", d);
        });
    }),
    (Olive.parentalConfirm = function (c) {
      var d = 0,
        e = new Olive.ConfirmDialog({
          title: Olive.loc("olv.portal.parental_confirm.title"),
          body: Olive.loc(
            "olv.portal.parental_confirm.body",
            Olive.loc("olv.portal.parental_control.function." + c)
          ),
          template: "#parental-confirm-dialog-template",
        }),
        f = jQuery(e.element).find("input.parental_code");
      return (
        e
          .ok(function (a) {
            var c = wiiuSystemSetting.checkParentalPinCode(f.val());
            f.val(""),
              c.result === !0
                ? this.close()
                : (a.preventDefault(),
                  d++,
                  Olive.deferredAlert(
                    Olive.loc(
                      "olv.portal.parental_confirm." +
                        (3 > d ? "fail_message" : "fail_many_times_message")
                    )
                  ));
          })
          .open(),
        e
      );
    }),
    Olive.init.done(function (a) {
      a(document.body).on("click", "[data-parental-confirm]", function (c) {
        if (!c.isDefaultPrevented()) {
          c.preventDefault();
          var d = a(this);
          Olive.parentalConfirm(a(c.target).attr("data-parental-confirm")).ok(
            function (a) {
              a.isDefaultPrevented() ||
                (d.removeAttr("data-parental-confirm"),
                setTimeout(function () {
                  d.trigger("click");
                }));
            }
          );
        }
      });
    }),
    jQuery(document).on("olv:modal:select-settings", function (c, d, e) {
      d.element.on("click.olvSelectSettings", ".post-button", function (c) {
        var e = jQuery(this);
        if (!Olive.Form.isDisabled(e) && !c.isDefaultPrevented()) {
          if ((c.preventDefault(), e.hasClass("selected")))
            return void d.close();
          var f = e.closest(".settings-page"),
            g = f.attr("data-name"),
            h = f.attr("data-action");
          if ("notice_opt_in" === g || "luminous_opt_in" === g) {
            var i = {
                notice_opt_in: {
                  1: "registerBossTask",
                  0: "unregisterBossTask",
                },
                luminous_opt_in: {
                  1: "registerDirectMessageTaskEx",
                  0: "unregisterDirectMessageTask",
                },
              },
              j = +jQuery(this).val(),
              k = i[g][j],
              l = Olive.Utils.callWiiuBOSSFuncWithFallback(k);
            return l.error
              ? void Olive.ErrorViewer.open(l.error)
              : (e.addClass("selected"),
                e.siblings().removeClass("selected"),
                d.triggerElement.text(e.text()),
                void d.close());
          }
          var m = {};
          (m[g] = e.val()),
            Olive.Form.post(h, m, e, !0)
              .done(function (a) {
                d.triggerElement.text(e.text()),
                  e.addClass("selected"),
                  e.siblings().removeClass("selected");
              })
              .always(function () {
                d.close();
              });
        }
      }),
        e.done(function () {
          d.element.off(".olvSelectSettings");
        });
    }),
    jQuery(document).on("olv:modal:title-settings", function (c, d, e) {
      var f = d.element.find(".settings-button"),
        g = f.get().map(function (b) {
          return jQuery(b).text();
        }),
        h = d.element.find(".close-button");
      h.on("click", function (c) {
        var e = f.get().some(function (b, c) {
          return jQuery(b).text() !== g[c];
        });
        d.close(), e && Olive.Browsing.reload();
      }),
        e.done(function () {
          h.off("click");
        });
    }),
    jQuery(document).on("olv:modal:preview-body", function (b, c, d) {
      var e = [],
        f = c.element.find(
          'input[name="body"],textarea[name="body"],[data-overlaid-preview]'
        );
      f.each(function () {
        var b,
          c = jQuery(this);
        c.attr("data-preview-class", function (a, c) {
          return (b = c || "textarea-text-preview");
        });
        var d = jQuery("<div/>").addClass(b).insertAfter(c);
        e.push(d);
      });
      var g = function (b) {
        var d = jQuery(b.target),
          e = d.val(),
          f = d.attr("data-preview-class"),
          g = c.element.find("." + f);
        g.text(e || d.attr("placeholder")), g.toggleClass("placeholder", !e);
      };
      f.on("input", g),
        f.trigger("input"),
        d.done(function () {
          f.off("input", g), jQuery(e).remove();
        });
    }),
    jQuery(document).on("olv:modal:require-body", function (b, c, d) {
      function e() {
        var b = /^\s*$/,
          c = h.length ? [h] : [g];
        return jQuery(c).is(function () {
          return !b.test(jQuery(this).val());
        });
      }
      function f() {
        return (
          l.filter(function () {
            return !jQuery(this).val();
          }).length > 0
        );
      }
      var g = c.element.find('input[name="body"],textarea[name="body"]'),
        h = c.element.find(".js-topic-title-input"),
        i = c.element.find('input[name="painting"]'),
        j = c.element.find('input[name="_post_type"]'),
        k = c.element.find('input[name="_post_type"][value="body"]'),
        l = c.element.find("select[data-required]"),
        m = c.element.find(".post-button"),
        n = function () {
          var a = !k.length || k.prop("checked"),
            b = a ? !e() || f() : !i.val();
          m.prop("disabled", b);
        };
      h.on("input", n),
        g.on("input", n),
        j.on("click", n),
        l.on("change", n),
        n(),
        d.done(function () {
          g.off("input", n), j.off("click", n);
        });
    }),
    (Olive.UserSearchButton = function (b, c) {
      (this.element = b),
        b.on(
          "input.userSearch",
          jQuery.proxy(function (a) {
            "" !== b.val() &&
              (this.search(b.val()), b.val(""), a.preventDefault());
          }, this)
        ),
        c.done(function () {
          b.off(".userSearch");
        });
    }),
    jQuery.extend(Olive.UserSearchButton.prototype, {
      search: function (b) {
        jQuery(document).trigger("olv:usersearch:search"),
          jQuery.pjax({
            url: "/users?query=" + encodeURIComponent(b),
            container: this.element.attr("data-pjax"),
          });
      },
    }),
    (Olive.TitleSearchButton = function (b, c) {
      (this.element = b),
        b.on(
          "input.titleSearch",
          jQuery.proxy(function (a) {
            "" !== b.val() &&
              (this.search(b.val()), b.val(""), a.preventDefault());
          }, this)
        ),
        c.done(function () {
          b.off(".titleSearch");
        });
    }),
    jQuery.extend(Olive.TitleSearchButton.prototype, {
      search: function (b) {
        jQuery(document).trigger("olv:titlesearch:search"),
          jQuery.pjax({
            url: "/titles/search?query=" + encodeURIComponent(b),
            container: this.element.attr("data-pjax"),
          });
      },
    }),
    (Olive.YouTubePlayer = {}),
    (Olive.YouTubePlayer.isApiLoaded = !1),
    (Olive.YouTubePlayer.setupQualityButton = function (c) {
      function d() {
        g = new YT.Player("post-video-player", {
          height: "504",
          width: "900",
          videoId: jQuery("#post-video-player").attr("data-video-id"),
          playerVars: { rel: 0, modestbranding: 1, iv_load_policy: 3 },
          events: { onStateChange: e },
        });
      }
      function e(a) {
        a.data === YT.PlayerState.PLAYING &&
          g.setPlaybackQuality(h.prop("checked") ? "hd720" : "medium");
      }
      function f(c) {
        if (!Olive.Form.isDisabled(h) && !c.isDefaultPrevented()) {
          var d = h.prop("checked");
          if (
            (jQuery
              .post("/settings/struct_video_quality", { is_hd: d ? 1 : 0 })
              .success(function () {}),
            g)
          )
            try {
              g.setPlaybackQuality(d ? "hd720" : "medium");
            } catch (e) {}
        }
      }
      var g,
        h = jQuery('#video-hd-button input[name="is_hd"]');
      if (Olive.YouTubePlayer.isApiLoaded) YT && d();
      else {
        var i = document.createElement("script");
        (i.src = "https://www.youtube.com/iframe_api"),
          document.getElementsByTagName("head")[0].appendChild(i),
          (window.onYouTubeIframeAPIReady = d),
          (Olive.YouTubePlayer.isApiLoaded = !0);
      }
      h.on("click", f),
        c.done(function () {
          h.off("click", f);
        });
    }),
    (Olive.User = {}),
    (Olive.User.setupFollowButton = function (c, d) {
      function e(c) {
        var d = jQuery(this);
        Olive.Form.isDisabled(d) ||
          (Olive.Form.post(d.attr("data-action"), null, d).done(function (b) {
            if (
              (d.addClass("none").siblings().removeClass("none"),
              jQuery(d).hasClass("relationship-button"))
            ) {
              var c = Array.prototype.slice.call(arguments);
              c.unshift(null), jQuery(d).trigger("olv:relationship:change:done", c);
            }
            "following_count" in b &&
              jQuery(d).trigger("olv:visitor:following-count:change", [
                b.following_count,
              ]);
          }),
          c.preventDefault());
      }
      function f(c, e, f, g, h, i) {
        (d.noReloadOnFollow &&
          jQuery(c.target).hasClass("follow-button") &&
          f.can_follow_more === !0) ||
          Olive.Browsing.reload();
      }
      function g(a, c, d, e, f, g) {
        g && f.status && 503 !== f.status && Olive.Browsing.reload();
      }
      (d = jQuery.extend({ noReloadOnFollow: !1 }, d)),
        jQuery(document).on("click", ".toggle-button .follow-button", e),
        jQuery(document).on(
          "olv:relationship:change:done",
          ".relationship-button",
          f
        ),
        jQuery(document).on(
          "olv:relationship:change:fail",
          ".relationship-button",
          g
        ),
        c.done(function () {
          jQuery(document).off("click", ".toggle-button .follow-button", e),
            jQuery(document).off(
              "olv:relationship:change:done",
              ".relationship-button",
              f
            ),
            jQuery(document).off(
              "olv:relationship:change:fail",
              ".relationship-button",
              g
            );
        });
    }),
    (Olive.User.setupAchievement = function (c) {
      function d(c) {
        var d = jQuery(c.target),
          e = d.attr("data-achievement-name");
        e &&
          Olive.Achievement.requestAchieveWithoutRegard([e]).done(function (a) {
            d.trigger("olv:achievement:update:done", [a]);
          });
      }
      jQuery(document).on("olv:achievement:update", d),
        c.done(function () {
          jQuery(document).off("olv:achievement:update", d);
        });
    }),
    (Olive.UserProfile = {}),
    (Olive.UserProfile.setupFavoriteGameGenreSelectors = function (c, d) {
      function e(a) {
        return a
          .map(function (a) {
            return ":not(" + a + ")";
          })
          .join("");
      }
      function f(b) {
        var c = jQuery(b),
          d = h.find("select[name=" + c.attr("name") + "]"),
          f = d.filter(e(["#" + c.attr("id")])),
          g = f.find("option[value=" + c.val() + "][data-is-configurable]"),
          i = d.find(":selected"),
          j = i
            .map(function () {
              return jQuery(this).val();
            })
            .get(),
          k = j.map(function (a) {
            return "[value=" + a + "]";
          }),
          l = e(k),
          m = f.find(l);
        g.prop("disabled", !0), m.prop("disabled", !1);
      }
      function g() {
        var c = jQuery(this),
          d = c.closest("form");
        Olive.Form.syncSelectedText(c),
          Olive.Form.submit(d).done(function () {
            c.trigger("olv:profile:favorite-game-genre:change");
          }),
          f(this);
      }
      var h = jQuery(c),
        i = h.find("select[name=favorite_game_genre]");
      i.each(function () {
        f(this);
      }),
        i.on("change", g),
        d.done(function () {
          i.off("change", g);
        });
    }),
    (Olive.EntryFormAlbumImageSelector = {}),
    (Olive.EntryFormAlbumImageSelector.setup = function (b) {
      var c = function (a, b) {
          var c = a.element.find(".js-album-list-pager"),
            d = c.attr("data-max-page-number");
          b > d ||
            1 > b ||
            (a.element
              .find(".js-album-selector-page[data-page-number=" + b + "]")
              .toggleClass("none", !1)
              .siblings(".js-album-selector-page")
              .toggleClass("none", !0),
            c.toggleClass("back-button-disabled", 1 == b),
            c.toggleClass("next-button-disabled", b == d),
            c.attr("data-current-page-number", b),
            c.find(".js-curent-page-number").text(b));
        },
        d = function (b, d, e) {
          var f = function (b) {
              b.preventDefault();
              var c = jQuery(b.target);
              c.trigger("olv:albumImageSelector:submit", [
                c.attr("data-album-image-id"),
                c.attr("data-album-image-preview-src"),
              ]),
                d.close();
            },
            g = d.element.find(".js-album-image-link");
          g.on("click", f);
          var h = d.element.find(".js-album-list-pager");
          if (h.length) {
            var i = function (a) {
                a.preventDefault(),
                  c(d, parseInt(h.attr("data-current-page-number")) - 1);
              },
              j = function (a) {
                a.preventDefault(),
                  c(d, parseInt(h.attr("data-current-page-number")) + 1);
              },
              k = d.element.find(".js-page-back-button");
            k.on("click", i);
            var l = d.element.find(".js-page-next-button");
            l.on("click", j),
              c(d, 1),
              e.done(function () {
                k.off("click", i), l.off("click", j);
              });
          }
          e.done(function () {
            g.off("click", f);
          });
        };
      jQuery(document).on("olv:modal:album-image-selector", d),
        b.done(function () {
          jQuery(document).off("olv:modal:album-image-selector", d);
        });
    }),
    (Olive.Entry = {}),
    (Olive.Entry.setupHiddenContents = function (b) {
      function c(b) {
        if (!b.isDefaultPrevented()) {
          b.preventDefault();
          var c = jQuery(this),
            d = c.closest(".hidden");
          d.removeClass("hidden"),
            d.find("[data-href-hidden]").each(function () {
              var b = jQuery(this);
              b.attr(
                b.is("a") ? "href" : "data-href",
                b.attr("data-href-hidden")
              );
            }),
            c.closest(".hidden-content").remove();
        }
      }
      jQuery(document).on("click", ".hidden-content-button", c),
        b.done(function () {
          jQuery(document).off("click", ".hidden-content-button", c);
        });
    }),
    (Olive.Entry._loadingEmpathies = []),
    (Olive.Entry.toggleEmpathy = function (c) {
      var d = Olive.Entry._loadingEmpathies;
      if (
        d.some(function (a) {
          return a[0] === c[0];
        })
      )
        return jQuery.Deferred().reject(null, "duplicate", null, !0);
      var e = Olive.Entry.isEmpathyAdded(c),
        f = c.attr("data-action");
      e && (f += ".delete");
      var g = Olive.Form.post(f, null, c)
        .done(function () {
          (e = !e), c.toggleClass("empathy-added", e);
          var a = c.attr("data-feeling") || "normal";
          c.text(Olive.loc("olv.portal.miitoo." + a + (e ? ".delete" : ""))),
            c.attr("data-sound", e ? "SE_WAVE_MII_CANCEL" : "SE_WAVE_MII_ADD"),
            c.trigger("olv:entry:empathy:toggle", [e]);
        })
        .always(function () {
          d.some(function (a, b) {
            return a[0] === c[0] && !!d.splice(b, 1);
          });
        });
      return d.push([c[0], g]), g;
    }),
    (Olive.Entry.abortLoadingEmpathies = function () {
      Olive.Entry._loadingEmpathies.concat().forEach(function (a) {
        a[1].abort();
      });
    }),
    jQuery(document).on("olv:pagechange", Olive.Entry.abortLoadingEmpathies),
    (Olive.Entry.isEmpathyAdded = function (a) {
      return a.hasClass("empathy-added");
    }),
    (Olive.Entry.setupEmpathyButtons = function (c, d) {
      function e(d) {
        if (!d.isDefaultPrevented()) {
          d.preventDefault();
          var e = jQuery(this);
          Olive.Form.isDisabled(e) ||
            Olive.Entry.toggleEmpathy(e).done(function () {
              var a = Olive.Entry.isEmpathyAdded(e),
                d = e.closest(c).find(".to-permalink-button .feeling");
              d.text(+d.text() + (a ? 1 : -1));
            });
        }
      }
      jQuery(document).on("click", ".miitoo-button", e),
        d.done(function () {
          jQuery(document).off("click", ".miitoo-button", e);
        });
    }),
    (Olive.Entry.setupPostEmpathyButton = function (c, d) {
      function e() {
        var a = Olive.Entry.isEmpathyAdded(g),
          c = +g.attr("data-other-empathy-count"),
          d =
            c > 0
              ? Olive.loc_n(
                  a
                    ? "olv.portal.empathy.you_and_n_added"
                    : "olv.portal.empathy.n_added",
                  c,
                  c
                )
              : a
              ? Olive.loc("olv.portal.empathy.you_added")
              : "";
        h.text(d), f.toggleClass("no-empathy", !d);
      }
      var f = jQuery(c),
        g = f.find(".miitoo-button"),
        h = f.find(".post-permalink-feeling-text"),
        i = f.find(".post-permalink-feeling-icon-container");
      e(),
        g.on("click", function (c) {
          if (!c.isDefaultPrevented()) {
            c.preventDefault();
            var d = jQuery(this);
            Olive.Form.isDisabled(d) ||
              Olive.Entry.toggleEmpathy(d).done(function () {
                var a = Olive.Entry.isEmpathyAdded(d);
                i.find(".visitor").toggle(a), i.find(".extra").toggle(!a), e();
              });
          }
        }),
        d.done(function () {
          g.off("click");
        });
    }),
    (Olive.Entry.setupBodyLanguageSelector = function (b) {
      function c(b) {
        var c = jQuery(d[0].options[d[0].selectedIndex]);
        e.text(c.text());
        var f = d.val();
        jQuery("#body-language-" + f)
          .toggleClass("none", !1)
          .siblings(".multi-language-body")
          .toggleClass("none", !0);
      }
      var d = jQuery("#body-language-selector"),
        e = d.siblings("span.select-button-content");
      d.on("change", c),
        b.done(function () {
          d.off("change", c);
        });
    }),
    (Olive.Entry.setupMoreContentButton = function (c) {
      function d(b) {
        b.preventDefault();
        var c = jQuery(b.target);
        c.prev().find(".wrapped").removeClass("none"), c.remove();
      }
      var e = jQuery(
        ".post-subtype-default #post-permalink-body.official-user .post-content-text"
      );
      e &&
        0 != e.length &&
        (e.each(function () {
          var d = jQuery(this),
            e = d.text().match(/([\s\S]+)(\n+---+\n[\s\S]+)/);
          if (e) {
            d.text(e[1]);
            var f = jQuery('<span class="wrapped none"></span>').text(e[2]);
            d.append(f);
            var g = jQuery('<a href="#" class="more-content-button"></a>');
            g.text(Olive.loc("olv.portal.read_more_content")),
              d.after(g),
              c.done(function () {
                g.remove();
              });
          }
        }),
        jQuery(document).on("click", ".more-content-button", d),
        c.done(function () {
          jQuery(document).off("click", ".more-content-button", d);
        }));
    }),
    (Olive.Entry.setupAppJumpButton = function (c) {
      function d(c) {
        if (wiiuDevice.existsTitle) {
          var d = jQuery(this),
            e = d.attr("data-app-jump-title-ids").split(","),
            f = d.attr("data-title-id");
          f && e.unshift(f);
          for (var g, h = 0; h < e.length; h++)
            if (wiiuDevice.existsTitle(e[h])) {
              g = e[h];
              break;
            }
          g
            ? Olive
                .deferredConfirm(Olive.loc("olv.portal.confirm_app_jump"))
                .done(function (a) {
                  if (a) {
                    var b = g,
                      c = 2,
                      e = +d.attr("data-nex-community-id"),
                      f = d.attr("data-app-data"),
                      h = d.attr("data-url-id");
                    wiiuBrowser.jumpToApplication(
                      b,
                      c,
                      e || -1,
                      f || "",
                      h || ""
                    );
                  }
                })
            : Olive.deferredAlert(Olive.loc("olv.portal.confirm_you_have_no_soft"));
        }
      }
      jQuery(document).on("click", ".app-jump-button", d),
        c.done(function () {
          jQuery(document).off("click", ".app-jump-button", d);
        });
    }),
    (Olive.Entry.setupMoreRepliesButton = function (c) {
      function d(c) {
        c.preventDefault();
        var d = jQuery(this);
        f ||
          Olive.Form.isDisabled(d) ||
          (d.addClass("loading"),
          (f = Olive.Form.get(d.attr("href"), null, d, !0)
            .done(function (b) {
              var c = jQuery(b);
              if (d.hasClass("all-replies-button")) {
                d.remove();
                var f = c
                  .filter(".post-permalink-reply")
                  .children()
                  .filter(function () {
                    return !jQuery("#" + this.id).length;
                  });
                e.find(".post-permalink-reply").prepend(f);
              } else e.empty().append(c);
              d.hasClass("newer-replies-button")
                ? g.scrollTop(jQuery("#post-permalink-comments").offset().top)
                : d.hasClass("older-replies-button") &&
                  g.scrollTop(jQuery(document).height());
            })
            .always(function () {
              d.removeClass("loading"), (f = null);
            })));
      }
      var e = jQuery("#post-permalink-comments"),
        f = null,
        g = jQuery(window);
      jQuery(document).on("click", ".more-button", d),
        c.done(function () {
          jQuery(document).off("click", ".more-button", d), f && f.abort();
        });
    }),
    (Olive.Entry.mayIncrementMoreRepliesButtonCount = function (c) {
      var d = jQuery(".oldest-replies-button, .all-replies-button");
      if (0 !== d.length && void 0 != c && 0 != c) {
        var e = +d.attr("data-reply-count");
        (e += c),
          d.text(Olive.loc_n("olv.portal.post.show_all_n_comments", e, e)),
          d.attr("data-reply-count", e);
      }
    }),
    (Olive.Entry.setupFirstPostNotice = function (c, d) {
      function e(c) {
        jQuery(document.body).attr("data-is-first-post") &&
          !Olive.Form.isDisabled(jQuery(this)) &&
          Olive
            .deferredAlert(Olive.loc("olv.portal.confirm_display_played_mark"))
            .done(function () {
              jQuery(document.body).removeAttr("data-is-first-post"),
                jQuery.post("/settings/struct_post").fail(function () {
                  jQuery(document.body).attr("data-is-first-post", "1");
                });
            });
      }
      jQuery(document).on("click", c, e),
        d.done(function () {
          jQuery(document).off("click", c, e);
        });
    }),
    (Olive.Entry.setupCreateDiaryOrSaveScreenshotWindow = function (c, d) {
      function e(c) {
        var d = !1,
          e = c.find(".js-diary-screenshot-window-image-container");
        if (!e.length) return d;
        var f = e.find(".js-screenshot-capture-button");
        if (
          (f.each(function (b, c) {
            var e = jQuery(c),
              f = null;
            try {
              f = wiiuMainApplication.getScreenShot(e.hasClass("js-tv"));
            } catch (g) {}
            f &&
              (e.find("img").prop("src", "data:image/jpeg;base64," + f),
              e.find('input[type="radio"]').prop("disabled", !1),
              (d = !0));
          }),
          d)
        )
          for (var g = 0, h = f.length; h > g; g++) {
            var i = f.eq(g).find("input[type=radio]");
            if (!i.prop("disabled")) {
              i.prop("checked", !0), Olive.Form.updateParentClass(i.get(0));
              break;
            }
          }
        return d;
      }
      function f() {
        var a = +j.attr("data-can-create") ? !0 : !1;
        if (a) {
          var b = e(j);
          b && j.toggleClass("no-screenshots", !1);
        }
        j.toggleClass("none", !1);
      }
      function g() {
        var a = null,
          b = j.find(".js-diary-screenshot-window-image-container"),
          c = b.find(".checked"),
          d = c.find("img").attr("src");
        return d && (a = d.match(/data:image\/jpeg;base64,(.+)/)[1]), a;
      }
      function h(a, c, d) {
        Olive.EntryForm.setupDiaryPostModal(c, g());
      }
      function i() {
        var c = j.find(".js-save-album"),
          d = c.find(".js-save-album-button");
        Olive.Form.isDisabled(d) ||
          (c.find("input[name=screenshot]").val(g()),
          event.preventDefault(),
          Olive.Form.submit(c, d, !0).done(function () {
            Olive.showConfirm(
              Olive.loc("olv.portal.album.save_album_image"),
              Olive.loc("olv.portal.album.save_album_image.confirm"),
              {
                okLabel: Olive.loc("olv.portal.continue_miiverse"),
                cancelLabel: Olive.loc("olv.portal.return_to_game"),
              }
            )
              .ok(function () {
                jQuery.pjax({
                  url: c.attr("data-redirect-url"),
                  container: c.attr("data-redirect-pjax"),
                });
              })
              .cancel(function () {
                setTimeout(function () {
                  wiiuBrowser.closeApplication();
                }, 0);
              });
          }));
      }
      var j = jQuery(c).eq(0);
      f(),
        jQuery(document).on("olv:modal:add-diary-post", h),
        j.find(".js-save-album-button").on("click", i),
        d.done(function () {
          jQuery(document).off("olv:modal:add-diary-post", h),
            j.find(".js-save-album-button").off("click", i);
        });
    }),
    jQuery(document).on("olv:modal:capture", function (a, b, c) {
      b.element
        .find(".capture")
        .attr("src", b.triggerElement.attr("data-large-capture-url"));
    }),
    jQuery(document).on("olv:modal:confirm-app-jump", function (a, b, c) {
      var d = b.element.find(".post-button");
      d.on("click", function (a) {
        var c = b.element.attr("data-app-jump-title"),
          e = 2,
          f = +d.attr("data-nex-community-id"),
          g = d.attr("data-app-data"),
          h = d.attr("data-url-id");
        wiiuBrowser.jumpToApplication(c, e, f || -1, g || "", h || "");
      }),
        c.done(function () {
          d.off("click");
        });
    }),
    jQuery(document).on("olv:modal:confirm-url", function (a, b, c) {
      var d = b.element.find(".post-button");
      d.on("click", function (a) {
        var c = b.element.find(".link-url").text();
        wiiuBrowser.jumpToBrowser(c);
      }),
        c.done(function () {
          d.off("click");
        });
    }),
    jQuery(document).on("olv:modal:report", function (a, c, d) {
      var e = c.element.find("form"),
        f = e.find(".post-button");
      f.on("click", function (a) {
        Olive.Form.isDisabled(f) ||
          a.isDefaultPrevented() ||
          (a.preventDefault(),
          Olive.Form.submit(e, f, !0).done(function () {
            c.close(), Olive.Browsing.reload();
          }));
      }),
        d.done(function () {
          f.off("click");
        });
    }),
    jQuery(document).on(
      "olv:modal:report-violator olv:modal:reply-admin-message",
      function (b, c, d) {
        function e() {
          var b = jQuery(g[0].options[g[0].selectedIndex]);
          j.text(b.text());
          var c = !!g.val();
          h.css("display", c ? "" : "none"), i.prop("disabled", !c);
        }
        function f() {
          var b = jQuery(g[0].options[g[0].selectedIndex]),
            c = !!b.attr("data-body-required"),
            d = !!g.val(),
            e = (c && /^\s*$/.test(h.val())) || !d;
          i.prop("disabled", e);
        }
        var g = c.element.find('select[name="type"]'),
          h = c.element.find('textarea[name="body"]'),
          i = c.element.find(".post-button"),
          j = c.element.find("span.select-button-content");
        e(),
          f(),
          h.on("input", f),
          g.on("change", e),
          g.on("change", f),
          d.done(function () {
            h.off("input", f), g.off("change", e), g.off("change", f);
          });
      }
    ),
    jQuery(document).on("olv:modal:report-violation", function (c, d, e) {
      function f() {
        var b = jQuery(m[0].options[m[0].selectedIndex]);
        p.text(b.text());
        var c = !!m.val();
        n.css("display", c ? "" : "none");
      }
      function g() {
        var b = jQuery(m[0].options[m[0].selectedIndex]),
          c = !!b.attr("data-body-required"),
          d = !!m.val(),
          e = (c && /^\s*$/.test(n.val())) || !d;
        o.prop("disabled", e);
      }
      var h = !!d.triggerElement.attr("data-is-post"),
        i = !!d.triggerElement.attr("data-is-message"),
        j = Olive.loc(
          h
            ? "olv.portal.report.report_violation"
            : i
            ? "olv.portal.report.report_violation_message"
            : "olv.portal.report.report_violation_comment",
          d.triggerElement.attr("data-screen-name")
        ),
        k = Olive.loc(
          h
            ? "olv.portal.report.report_post_id"
            : i
            ? "olv.portal.report.report_message_id"
            : "olv.portal.report.report_comment_id",
          d.triggerElement.attr("data-support-text")
        );
      d.element.find(".window-title").text(j),
        d.element.find(".post-id").text(k),
        d.element
          .find("form")
          .attr("action", d.triggerElement.attr("data-action"));
      var l = "1" === d.triggerElement.attr("data-can-report-spoiler"),
        m = l
          ? d.element.find("select.can-report-spoiler")
          : d.element.find("select.cannot-report-spoiler");
      d.element.find('select[name="type"]').hide().prop("disabled", !0),
        m.show().prop("disabled", !1);
      var n = d.element.find('textarea[name="body"]'),
        o = d.element.find(".post-button"),
        p = d.element.find("span.select-button-content");
      f(),
        g(),
        n.on("input", g),
        m.on("change", f),
        m.on("change", g),
        e.done(function () {
          n.off("input", g), m.off("change", f), m.off("change", g);
        });
    }),
    (Olive.Entry.setupEditButtons = function (c) {
      function d(c) {
        var d = Olive.Form.post(c.action, { format: "html" }, c.button, !0).done(
          function (b) {
            jQuery("#body").html(b);
          }
        );
        return c.modal.element.trigger("olv:entry:post:delete", c), d;
      }
      function e(c) {
        var d = Olive.Form.post(c.action, null, c.button, !0).done(function () {
          var b = c.modal.triggerElement.closest(
            "#post-permalink-content, #post-permalink-comments"
          );
          c.option.prop("disabled", !0);
          var d = function () {
            b.find(".spoiler-status").fadeIn(400, function () {
              jQuery(this).addClass("spoiler");
            });
          };
          c.modal.guard.done(function () {
            setTimeout(d, 0);
          });
        });
        return d;
      }
      function f(a) {
        a.modal.close(),
          Olive
            .showConfirm(
              Olive.loc("olv.portal.profile_post"),
              Olive.loc("olv.portal.profile_post.confirm_update"),
              {
                okLabel: Olive.loc("olv.portal.profile_post.confirm_update.yes"),
                cancelLabel: Olive.loc("olv.portal.cancel"),
              }
            )
            .ok(function () {
              var c = this;
              c.element.find(".button").prop("disabled", !0),
                Olive.Form.post(a.action, null, a.button, !0).done(function () {
                  c.element.trigger("olv:entry:profile-post:set"),
                    c.close(),
                    Olive
                      .showConfirm(
                        Olive.loc("olv.portal.profile_post"),
                        Olive.loc("olv.portal.profile_post.done"),
                        {
                          okLabel: Olive.loc("olv.portal.user.search.go"),
                          cancelLabel: Olive.loc("olv.portal.close"),
                        }
                      )
                      .ok(function () {
                        location.href = "/users/@me";
                      });
                });
            });
      }
      function g(a, c, g) {
        function h() {
          var a = k.find(":selected");
          l.text(a.text());
          var c = a.attr("data-action");
          j.attr("action", c), Olive.Form.toggleDisabled(m, !c);
        }
        function i(a) {
          if (!Olive.Form.isDisabled(m) && !a.isDefaultPrevented()) {
            a.preventDefault();
            var g,
              h = {
                action: j.attr("action"),
                button: m,
                modal: c,
                option: k.find(":selected"),
              },
              i = k.val();
            "delete" == i
              ? (g = d(h))
              : "spoiler" == i
              ? (g = e(h))
              : "painting-profile-post" === i || "screenshot-profile-post" === i
              ? (g = f(h))
              : c.close(),
              g &&
                g.always(function () {
                  c.close();
                });
          }
        }
        var j = (c.triggerElement, c.element.find("form.edit-post-form")),
          k = j.find('select[name="edit-type"]'),
          l = j.find("span.select-button-content"),
          m = j.find(".post-button");
        k.val(""),
          h(),
          k.on("change", h),
          m.on("click", i),
          g.done(function () {
            k.off("change", h), m.off("click", i);
          });
      }
      jQuery(document).on("olv:modal:edit-post", g),
        c.done(function () {
          jQuery(document).off("olv:modal:edit-post", g);
        });
    }),
    jQuery(document).on("olv:modal:album-detail", function (a, c, d) {
      var e = c.element.find("form"),
        f = e.find(".js-album-delete-button");
      f.on("click", function (a) {
        Olive.Form.isDisabled(f) ||
          a.isDefaultPrevented() ||
          (a.preventDefault(),
          Olive.confirm(Olive.loc("olv.portal.album.delete_confirm")) &&
            Olive.Form.submit(e, f, !0).done(function () {
              c.close(), Olive.Browsing.reload();
            }));
      }),
        d.done(function () {
          f.off("click");
        });
    }),
    (Olive.Entry.setupCloseTopicPostButton = function (c) {
      var d = jQuery(document).find(".js-close-topic-post-form"),
        e = d.find(".js-close-topic-post-button");
      e.on("click", function (c) {
        Olive.Form.isDisabled(e) ||
          c.isDefaultPrevented() ||
          (c.preventDefault(),
          Olive
            .showConfirm(
              Olive.loc("olv.portal.edit.action.close_topic_post"),
              Olive.loc("olv.portal.edit.action.close_topic_post.confirm"),
              {
                okLabel: Olive.loc("olv.portal.yes"),
                cancelLabel: Olive.loc("olv.portal.stop"),
              }
            )
            .ok(function () {
              Olive.Form.post(d.attr("action"), null, e, !0).done(function () {
                jQuery(document)
                  .find(".js-topic-answer-accepting-status")
                  .removeClass("accepting")
                  .addClass("not-accepting"),
                  d.remove();
              }),
                this.close();
            }));
      }),
        c.done(function () {
          e.off("click");
        });
    }),
    (Olive.EntryForm = {}),
    (Olive.EntryForm.setupFeelingSelector = function (a, b) {
      function c() {
        e.attr("src", d.find("input:checked").attr("data-mii-face-url"));
      }
      var d = a.find(".feeling-selector"),
        e = a.find(".icon");
      d.on("click", "input", c),
        b.done(function () {
          d.off("click", "input", c);
        });
    }),
    (Olive.EntryForm.setupSpoilerCheck = function (a, b) {
      var c = a.find('input[name="is_spoiler"]');
      c.on("click", function () {
        c.attr(
          "data-sound",
          c.prop("checked")
            ? "SE_WAVE_CHECKBOX_CHECK"
            : "SE_WAVE_CHECKBOX_UNCHECK"
        );
      }),
        b.done(function () {
          c.off("click");
        });
    }),
    (Olive.EntryForm.setupTopicCategories = function (a, c) {
      function d() {
        Olive.Form.syncSelectedText(f);
      }
      var e = a.find(".select-content-topic"),
        f = e.find(".topic-category-selector");
      if (f.length) {
        e.find(".select-button-content");
        d(),
          f.on("change", d),
          c.done(function () {
            f.off("change", d);
          });
      }
    }),
    (Olive.EntryForm.openPaintingDialog = function (b) {
      var c = jQuery.Deferred();
      window.wiiuMemo.open(b);
      var d = setInterval(function () {
        wiiuMemo.isFinish() && (clearInterval(d), c.resolve());
      }, 40);
      return c.promise();
    }),
    (Olive.EntryForm.setupPostTypeChanger = function (a, c) {
      function d() {
        var a = l.prop("checked");
        k.toggleClass("active-text", a),
          k.toggleClass("active-memo", !a),
          n.prop("disabled", !a),
          o.prop("disabled", a);
      }
      function e() {
        Olive.EntryForm.openPaintingDialog(r).done(f),
          (r = !1),
          o.val("painting-started");
      }
      function f() {
        var a = wiiuMemo.getImage(!1),
          b = "data:image/bmp;base64," + a;
        q.css("background-image", "url(" + b + ")");
      }
      function g() {
        if (!o.prop("disabled")) {
          var a = wiiuMemo.getImage(!0);
          o.val(a);
        }
      }
      function h() {
        d(), n.focus();
      }
      function i(a) {
        return wiiuDevice.isDrc()
          ? (d(), void e())
          : (l.prop("checked", !0),
            void Olive.deferredAlert(Olive.loc("olv.portal.error.memo_needs_drc")));
      }
      function j(a) {
        m.trigger("click");
      }
      var k = a.find(".textarea-with-menu"),
        l = a.find('input[name="_post_type"][value="body"]'),
        m = a.find('input[name="_post_type"][value="painting"]'),
        n = a.find('input[name="body"],textarea[name="body"]'),
        o = a.find('input[name="painting"]'),
        p = a.find(".textarea-memo"),
        q = a.find(".textarea-memo-preview"),
        r = !0;
      a.on("olv:form:submit", g),
        l.on("click", h),
        m.on("click", i),
        p.on("click", j),
        d(),
        c.done(function () {
          a.off("olv:form:submit", g),
            l.off("click", h),
            m.off("click", i),
            p.off("click", j);
        });
    }),
    (Olive.EntryForm.setupAlbumImageSelector = function (b, c) {
      var d = function (a, c, d) {
          b.find('input[name="album_image_id"]').val(c);
          var e = b.find("input.js-album-screenshot-type");
          e.attr("data-src", d).attr("checked", !0).click();
        },
        e = function (c) {
          jQuery(c.target).hasClass("js-album-screenshot-type") ||
            b.find('input[name="album_image_id"]').val("");
        };
      jQuery(document).on("olv:albumImageSelector:submit", d),
        b.find('input[name="screenshot_type"]').on("click", e),
        c.done(function () {
          jQuery(document).off("olv:albumImageSelector:submit", d),
            b.find('input[name="screenshot_type"]').off("click", e);
        });
    }),
    (Olive.EntryForm.setupImageSelector = function (c, d) {
      function e(a, b) {
        g.prop("disabled", !a).val(a),
          h.attr("src", b || "data:image/jpeg;base64," + a);
      }
      var f = c.find(".image-selector");
      if (f.length) {
        if (f.hasClass("disabled"))
          return (
            Olive.EntryForm.setupForbiddenImageSelector(c, d),
            void c
              .find('input[name="screenshot"]')
              .attr("data-is-capture-forbidden", "1")
          );
        var g = f.find('input[name="screenshot"]'),
          h = f.find(".preview-image"),
          i = {
            drc: function () {
              return wiiuMainApplication.getScreenShot(!1);
            },
            tv: function () {
              return wiiuMainApplication.getScreenShot(!0);
            },
          },
          j = !1;
        if (
          (jQuery.each(i, function (a, b) {
            var c = f.find('input[name="screenshot_type"][value="' + a + '"]');
            if (c.length) {
              var d = null;
              try {
                d = b();
              } catch (e) {}
              if (!d)
                return (
                  c.closest("label").css("pointer-events", "none"),
                  void c.remove()
                );
              c.attr("data-value", d),
                c.siblings("img").attr("src", "data:image/jpeg;base64," + d),
                (j = !0);
            }
          }),
          j ||
            (f.find(".js-image-selector-section-capture").addClass("none"),
            c
              .find('input[name="screenshot"]')
              .attr("data-is-capture-forbidden", "1")),
          jQuery(document.body).find("#album-image-selector").length > 0 &&
            (Olive.EntryForm.setupAlbumImageSelector(c, d), (j = !0)),
          !j)
        )
          return void Olive.EntryForm.setupForbiddenImageSelector(c, d);
        var k = f.find('input[name="screenshot_type"]');
        k.prop("disabled", !1),
          k.on("click", function (b) {
            var c = jQuery(this),
              d = c.attr("data-value"),
              f = c.attr("data-src");
            e(d, f);
          }),
          d.done(function () {
            k.off("click");
          });
      }
    }),
    (Olive.EntryForm.setupForbiddenImageSelector = function (a, c) {
      function d(a) {
        a.preventDefault(),
          Olive.deferredAlert(Olive.loc("olv.portal.post.screenshot_forbidden"));
      }
      var e = a.find(".image-selector"),
        f = e.find(".dropdown-toggle");
      e.addClass("disabled"),
        f.removeAttr("data-toggle"),
        f.removeAttr("data-sound"),
        f.addClass("forbidden"),
        f.on("click", d),
        c.done(function () {
          f.off("click", d);
        });
    }),
    (Olive.EntryForm.setupSubmission = function (a, c, d, e) {
      var f = c.find(".post-button");
      f.on("click", function (e) {
        if (!Olive.Form.isDisabled(f) && !e.isDefaultPrevented()) {
          e.preventDefault();
          var g = c.find('input[name="screenshot"]');
          return +g.attr("data-is-required-unless-forbidden") &&
            !+g.attr("data-is-capture-forbidden") &&
            g.attr("disabled") &&
            !c.find('input[name="album_image_id"]').val()
            ? void Olive.deferredAlert(Olive.loc("olv.portal.post.screenshot_required"))
            : void Olive.Form.submit(c, f, !0)
                .done(function () {
                  var b = [a];
                  b.push.apply(b, arguments), d.apply(this, b);
                })
                .fail(function () {
                  c.find('input[name="body"], textarea[name="body"]').trigger(
                    "input"
                  );
                });
        }
      }),
        e.done(function () {
          f.off("click");
        });
    }),
    (Olive.EntryForm.onAddPostDone = function (b, c) {
      var d = b.element.find("#topic_posts-form");
      if (d.length && !d.attr("data-is-identified")) {
        var e = jQuery(c).attr("data-post-permalink-url");
        jQuery("#add-topic-post-error-page .js-view-existing-post").attr("href", e),
          jQuery("#header-post-button").attr(
            "data-modal-open",
            "#add-topic-post-error-page"
          );
      }
      b.close(),
        jQuery(".js-no-content").remove(),
        jQuery(c)
          .prependTo(jQuery(".js-post-list"))
          .trigger("olv:entry:add-to-list:done");
    }),
    (Olive.EntryForm.onAddMessageDone = function (c, d) {
      c.close(),
        jQuery(".js-no-content").remove(),
        jQuery(".message-post-list").prepend(d);
      var e = Olive.UpdateChecker.getInstance();
      e.interval_ = e.initialInterval_;
    }),
    (Olive.EntryForm.onAddReplyDone = function (c, d) {
      Olive.UpdateChecker.getInstance();
      c.close();
      var e = 0;
      if (d) {
        var f = jQuery(d),
          g = jQuery(".post-permalink-reply li")
            .map(function () {
              return "#" + jQuery(this).attr("id");
            })
            .toArray()
            .join(","),
          h = "" == g ? f : f.filter(":not(" + g + ")");
        h.length > 0 && (e += h.length), jQuery(".post-permalink-reply").append(h);
      }
      Olive.Entry.mayIncrementMoreRepliesButtonCount(e),
        jQuery(window).scrollTop(jQuery(document).height());
    }),
    jQuery(document).on("olv:modal:add-entry", function (a, c, d) {
      var e = c.element.find("form");
      Olive.EntryForm.setupFeelingSelector(e, d),
        Olive.EntryForm.setupSpoilerCheck(e, d),
        Olive.EntryForm.setupTopicCategories(e, d),
        Olive.EntryForm.setupPostTypeChanger(e, d);
    }),
    jQuery(document).on(
      "olv:modal:open-topic-post-existing-error",
      function (a, c, d) {
        var e = function (a) {
          c.close();
        };
        Olive.EntryForm.getCheckCanPost(function () {}, e);
      }
    ),
    jQuery(document).on("olv:modal:add-message", function (a, c, d) {
      var e = c.triggerElement.attr("data-user-id");
      if (e) {
        var f = c.triggerElement.attr("data-screen-name"),
          g = Olive.loc("olv.portal.friend_message_to", f, e);
        c.element.find(".window-title").text(g),
          c.element.find('input[name="message_to_user_id"]').val(e);
      }
    }),
    jQuery(document).on(
      "olv:modal:add-post olv:modal:add-message",
      function (a, c, d) {
        var e = c.element.find("form"),
          f = "olv:modal:add-post" === a.type;
        f && Olive.EntryForm.checkCanPost(c, e),
          Olive.EntryForm.setupImageSelector(e, d);
        var g = f ? Olive.EntryForm.onAddPostDone : Olive.EntryForm.onAddMessageDone;
        Olive.EntryForm.setupSubmission(c, e, g, d);
      }
    ),
    jQuery(document).on("olv:modal:add-reply", function (a, c, d) {
      var e = c.element.find("form");
      Olive.EntryForm.checkCanPost(c, e),
        Olive.EntryForm.setupImageSelector(e, d),
        Olive.EntryForm.setupSubmission(c, e, Olive.EntryForm.onAddReplyDone, d);
    }),
    (Olive.EntryForm.mayOpenModalInitially = function (c, d, e, f) {
      function g(a) {
        window.history.back();
      }
      function h(b) {
        var d = c.href.replace(/#.*/, "");
        jQuery.pjax.state && jQuery.pjax.state.url && (jQuery.pjax.state.url = d),
          window.history.replaceState(jQuery.pjax.state, "", d),
          i();
      }
      if (c.hash === d) {
        Olive.init.done(function () {
          var a = Olive.ModalWindowManager.createNewModal(e);
          a.open(),
            a.element
              .find(".olv-modal-close-button")
              .removeClass("olv-modal-close-button")
              .addClass("js-entryform-back-button");
        });
        var i = function () {
          jQuery(document).off("click", ".js-entryform-back-button", g),
            jQuery(document).off("olv:modalclose", ".add-post-page", h);
        };
        jQuery(document).on("click", ".js-entryform-back-button", g),
          jQuery(document).on("olv:modalclose", ".add-post-page", h),
          f.done(i);
      }
    }),
    (Olive.EntryForm.checkCanPost = function (a, c) {
      function d(a, b) {
        var c = b.remaining_today_posts;
        a.element.find(".remaining-today-post-count").text(c),
          a.element.find(".js-post-count-container").removeClass("none");
      }
      var e = function (b) {
          d(a, b);
        },
        f = function (b) {
          a.close();
        };
      Olive.EntryForm.getCheckCanPost(e, f);
    }),
    (Olive.EntryForm.getCheckCanPost = function (c, d) {
      Olive.Net.ajax({
        type: "GET",
        url:
          "/users/" +
          jQuery(document.body).attr("data-user-id") +
          "/check_can_post.json",
      })
        .done(function (a) {
          c(a);
        })
        .fail(function (a) {
          d(a);
        });
    }),
    (Olive.EntryForm.setupDiaryPostModal = function (a, b) {
      var c = a.element.find("form"),
        d = c.find(".image-selector"),
        e = d.find(".dropdown-toggle"),
        f = d.find('input[name="screenshot"]'),
        g = d.find(".preview-image");
      b
        ? (f.prop("disabled", !b).val(b),
          g.attr("src", "data:image/jpeg;base64," + b),
          d.addClass("disabled"),
          e.removeAttr("data-toggle"),
          e.removeAttr("data-sound"))
        : (d.addClass("disabled"),
          e.removeAttr("data-toggle"),
          e.removeAttr("data-sound"),
          e.addClass("forbidden"));
    }),
    (Olive.Relationship = {}),
    (Olive.Relationship.isFirstFriend = function () {
      return !!jQuery(document.body).attr("data-is-first-friend");
    }),
    (Olive.Relationship.confirmFirstFriend = function () {
      return Olive
        .deferredConfirm(Olive.loc("olv.portal.friend.first_request_confirm"))
        .done(function (b) {
          b && jQuery(document.body).removeAttr("data-is-first-friend");
        })
        .promise();
    }),
    (Olive.Relationship.setupFirstFriendConfirm = function (c) {
      function d(c) {
        Olive.Relationship.isFirstFriend() &&
          (c.preventDefault(),
          Olive.Relationship.confirmFirstFriend().done(function (b) {
            b && jQuery(c.target).trigger("click");
          }));
      }
      var e = '[data-modal-open="#friend-request-post-page"]';
      jQuery(document).on("olv:modalopen", e, d),
        c.done(function () {
          jQuery(document).off("olv:modalopen", e, d);
        });
    }),
    (Olive.Relationship.fillInConfirmDialog = function (a) {
      var c = a.triggerElement,
        d = a.element;
      d.find(".screen-name").text(c.attr("data-screen-name")),
        d.find(".id-name").text(c.attr("data-user-id")),
        d.find(".icon").attr("src", c.attr("data-mii-face-url")),
        c.attr("data-is-identified") &&
          d.find(".icon-container").addClass("official-user");
      var e = c.attr("data-body");
      if (void 0 !== e) {
        var f = d.find(".message-inner");
        e || f.addClass("no-message"),
          f.text(e || Olive.loc("olv.portal.friend_request.no_message"));
      }
      var g = c.attr("data-timestamp");
      void 0 !== g && d.find(".timestamp").text(g);
    }),
    (Olive.Relationship.setupForPage = function (a, c, d) {
      Olive.Relationship.isFirstFriend() &&
        Olive.Relationship.setupFirstFriendConfirm(d);
    }),
    Olive.router.connect(/^/, Olive.Relationship.setupForPage),
    jQuery(document).on("olv:modal:confirm-relationship", function (c, d, e) {
      function f(b, c, e) {
        var f = c.length ? { relatedTarget: c[0] } : null,
          g = jQuery.Event(b, f),
          h = [d];
        return (
          e && h.push.apply(h, e), i.trigger(g, h), !g.isDefaultPrevented()
        );
      }
      function g(a) {
        if (
          !Olive.Form.isDisabled(k) &&
          !a.isDefaultPrevented() &&
          (a.preventDefault(), f("olv:relationship:change", k))
        ) {
          var c = k.attr("data-action") || i.attr("data-action"),
            e = i.attr("data-pid"),
            g = e ? { pid: e } : null;
          Olive.Form.post(c, g, k, !0)
            .done(function () {
              var a = j.find(".window-title").text(),
                c = i.attr("data-screen-name"),
                e = Olive.loc(k.attr("data-done-msgid"), c),
                g = arguments;
              Olive.showMessage(a, e).ok(function () {
                var a = this.element.find(".ok-button");
                f("olv:relationship:change:done", a, g) &&
                  Olive.ModalWindowManager.closeUntil(d);
              });
            })
            .fail(function () {
              f("olv:relationship:change:fail", k, arguments) &&
                Olive.ModalWindowManager.closeUntil(d);
            });
        }
      }
      function h(a) {
        Olive.Form.isDisabled(l) ||
          a.isDefaultPrevented() ||
          (a.preventDefault(),
          f("olv:relationship:cancel", l) &&
            Olive.ModalWindowManager.closeUntil(d));
      }
      Olive.Relationship.fillInConfirmDialog(d);
      var i = d.triggerElement,
        j = d.element,
        k = j.find(".post-button"),
        l = j.find(".cancel-button");
      k.on("click", g),
        l.on("click", h),
        e.done(function () {
          k.off("click", g), l.off("click", h);
        });
    }),
    jQuery(document).on("olv:modal:confirm-received-request", function (c, d, e) {
      function f(c, d) {
        Olive.Relationship.isFirstFriend() &&
          (c.preventDefault(),
          Olive.Relationship.confirmFirstFriend().done(function (b) {
            b ? jQuery(c.relatedTarget).trigger("click") : d.close();
          }));
      }
      var g = d.triggerElement;
      g.on("olv:relationship:change", f),
        e.done(function () {
          g.off("olv:relationship:change", f);
        });
    }),
    jQuery(document).on("olv:modal:post-friend-request", function (a, c, d) {
      function e(a) {
        if (!Olive.Form.isDisabled(g) && !a.isDefaultPrevented()) {
          a.preventDefault();
          var d = g.closest("form"),
            e = d.find("input[name=body]").val();
          return Olive.Utils.containsNGWords(e)
            ? void Olive.ErrorViewer.deferredOpen(Olive.Utils.ERROR_CONTAINS_NG_WORDS)
            : void Olive.Form.submit(d, g, !0)
                .done(function () {
                  var a = f.find(".window-title").text(),
                    d = f.find(".screen-name").text(),
                    e = Olive.loc("olv.portal.friend_request.send_succeeded_to", d);
                  Olive.showMessage(a, e).ok(function () {
                    Olive.ModalWindowManager.closeUntil(c), Olive.Browsing.reload();
                  });
                })
                .fail(function (a, d, e, f) {
                  if (f) {
                    var g =
                      (a &&
                        a.errors &&
                        a.errors[0] &&
                        +a.errors[0].error_code) ||
                      0;
                    g >= 1210110 &&
                      1210129 >= g &&
                      (Olive.ModalWindowManager.closeUntil(c), Olive.Browsing.reload());
                  }
                });
        }
      }
      var f = c.element,
        g = f.find(".post-button");
      g.on("click", e),
        d.done(function () {
          g.off("click", e);
        });
    }),
    Olive.init.done(function () {
      "undefined" != typeof wiiuBrowser &&
        "undefined" != typeof wiiuBrowser.endStartUp &&
        wiiuBrowser.endStartUp();
    }),
    Olive.router.connect("^/$", function (c, d, e) {
      function f() {
        Olive.Form.setupForPage(),
          Olive.Content.autopagerize(".js-post-list", e),
          jQuery("#header-post-button").toggleClass("none", !1);
        var c = jQuery("input.user-search-query");
        new Olive.UserSearchButton(c, e);
      }
      Olive.Entry.setupHiddenContents(e),
        Olive.Entry.setupEmpathyButtons(".post-meta", e),
        Olive.Content.setupReloadKey(e),
        Olive.Tutorial.setupCloseButtons(e),
        Olive.User.setupFollowButton(e);
      var g,
        h,
        i = jQuery(".content-loading-window"),
        j = "friend" !== Olive.Cookie.get("view_activity_filter");
      (h = j
        ? Olive.Net.ajax({
            type: "GET",
            url: "/my/latest_following_related_profile_posts",
            silent: !0,
          })
        : jQuery.Deferred().resolve().promise()),
        (g = i.length
          ? Olive.Net.ajax({ type: "GET", url: d.pathname + d.search, silent: !0 })
              .done(function (b) {
                var c = jQuery(b);
                c.find("title").remove(), jQuery("#body").html(c);
              })
              .fail(function () {
                i.remove(), jQuery(".content-load-error-window").removeClass("none");
              })
          : jQuery.Deferred().resolve().promise()),
        g.then(function () {
          f();
        }),
        jQuery
          .when(g, h)
          .done(function (b, c) {
            var d = jQuery(jQuery.trim(c[0])),
              e = self.$(
                "[data-latest-following-relation-profile-post-placeholder]"
              ),
              f = [];
            e.each(function (b, c) {
              var e = d.get(b);
              e && (jQuery(c).html(e), f.push(c));
            }),
              jQuery(f).removeClass("none");
          })
          .done(function () {
            Olive.User.setupFollowButton(e);
          }),
        e.done(function () {
          g.abort && g.abort();
        });
    }),
    Olive.router.connect("^/titles/search$", function (c, d, e) {
      var f = jQuery(".body-content input.title-search-query");
      new Olive.TitleSearchButton(f, e);
    }),
    Olive.router.connect(
      "^/communities(?:/favorites|/played)?$",
      function (c, d, e) {
        Olive.Tutorial.setupCloseButtons(e),
          Olive.Community.setupInfoTicker(e),
          Olive.Content.autopagerize("#community-top-content", e);
        var f = jQuery(".body-content input.title-search-query");
        new Olive.TitleSearchButton(f, e);
      }
    ),
    Olive.router.connect("^/communities/categories/[a-z]+$", function (c, d, e) {
      Olive.Tutorial.setupCloseButtons(e),
        Olive.Content.autopagerize("#community-top-content", e);
      var f = jQuery(".category-top-of-more");
      f.length &&
        (window.scrollTo(0, f.offset().top),
        f.removeClass("category-top-of-more"));
    }),
    Olive.router.connect("^/identified_user_posts$", function (a, c, d) {
      Olive.User.setupFollowButton(d),
        Olive.Content.autopagerize(".js-post-list", d),
        Olive.Content.setupReloadKey(d);
    }),
    Olive.router.connect(
      "^/titles/[0-9]+/[0-9]+(/diary|/artwork(/new|/hot)?|/topic(/new|/open)?|/new|/hot|/in_game|/old)?$",
      function (c, d, e) {
        function f(a) {
          window.scrollTo(0, 0);
        }
        Olive.Community.setupInfoTicker(e),
          Olive.Community.setupFavoriteButtons(e),
          Olive.Community.setupUnfavoriteButtons(e),
          Olive.Community.setupAppJumpButtons(e),
          Olive.Community.setupShopButtons(e),
          Olive.Community.setupPostButton(e),
          Olive.Community.setupURLSelector("#post-filter select", e),
          Olive.Community.setupSelectButton(".js-select-post-filter", e),
          Olive.Community.setupURLSelector(".js-select-post-filter", e),
          Olive.Community.setupTopicPostButton(e),
          Olive.Tutorial.setupBalloon(".js-tutorial-balloon", e),
          Olive.Entry.setupHiddenContents(e),
          Olive.Entry.setupEmpathyButtons(".post-meta", e),
          Olive.Entry.setupFirstPostNotice("#header-post-button", e),
          Olive.Content.autopagerize(".js-post-list", e),
          Olive.Content.setupReloadKey(e),
          jQuery(".toggle-button").length && Olive.User.setupFollowButton(e),
          Olive.EntryForm.mayOpenModalInitially(
            d,
            "#js_open_post_modal",
            "#header-post-button",
            e
          ),
          Olive.EntryForm.mayOpenModalInitially(
            d,
            "#js_open_artwork_post_from_album_modal",
            ".js-open-artwork-post-from-album-modal",
            e
          ),
          Olive.EntryFormAlbumImageSelector.setup(e),
          jQuery(document).on("olv:entry:add-to-list:done", f),
          e.done(function () {
            jQuery(document).off("olv:entry:add-to-list:done", f);
          });
      }
    ),
    Olive.router.connect(/^\/posts\/([0-9A-Za-z\-_]+)$/, function (c, d, e) {
      Olive.Entry.setupPostEmpathyButton("#post-permalink-content", e),
        Olive.Entry.setupEditButtons(e),
        Olive.Entry.setupMoreRepliesButton(e),
        Olive.Entry.setupAppJumpButton(e),
        Olive.Entry.setupHiddenContents(e),
        Olive.Entry.setupFirstPostNotice("#header-reply-button", e),
        Olive.Entry.setupEmpathyButtons(".reply-meta", e),
        Olive.Entry.setupCloseTopicPostButton(e),
        Olive.Content.setupReloadKey(e),
        Olive.Form.setupDisabledMessage(e),
        Olive.YouTubePlayer.setupQualityButton(e),
        Olive.Entry.setupMoreContentButton(e),
        jQuery("#body-language-selector").length &&
          Olive.Entry.setupBodyLanguageSelector(e),
        Olive.EntryFormAlbumImageSelector.setup(e);
    }),
    Olive.router.connect(/^\/replies\/([0-9A-Za-z\-_]+)$/, function (c, d, e) {
      Olive.Entry.setupPostEmpathyButton("#post-permalink-comments", e),
        Olive.Entry.setupEditButtons(e),
        jQuery("#body-language-selector").length &&
          Olive.Entry.setupBodyLanguageSelector(e);
    }),
    Olive.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+(/empathies|/posts)$",
      function (a, c, d) {
        Olive.Entry.setupHiddenContents(d),
          Olive.Entry.setupEmpathyButtons(".post-meta", d),
          Olive.Content.autopagerize(".js-post-list", d),
          Olive.Content.setupReloadKey(d);
      }
    ),
    Olive.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+(/friends|/following|/followers)$",
      function (a, c, d) {
        Olive.Content.autopagerize("#friend-list-content", d),
          Olive.Content.setupReloadKey(d);
      }
    ),
    Olive.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+(/friends|/following|/followers|/empathies|/posts)?$",
      function (c, d, e) {
        function f(b, c) {
          jQuery(".user-page.is-visitor .js-following-count").text(c);
        }
        Olive.Form.setupDisabledMessage(e),
          Olive.User.setupFollowButton(e, { noReloadOnFollow: !0 }),
          Olive.Tutorial.setupBalloon(".js-tutorial-balloon", e),
          jQuery(document).on("olv:visitor:following-count:change", f),
          e.done(function () {
            jQuery(document).off("olv:visitor:following-count:change", f);
          }),
          Olive.Entry.setupHiddenContents(e),
          Olive.Entry.setupEmpathyButtons(".post-meta", e);
      }
    ),
    Olive.router.connect("^/users/[0-9a-zA-Z\\-_.]+(/diary)$", function (c, d, e) {
      function f(b) {
        var c = jQuery(b.target),
          d = 10;
        window.scrollTo(0, c.offset().top - d),
          c.attr("data-test-scrolled", "1");
      }
      Olive.Entry.setupHiddenContents(e),
        Olive.Entry.setupEmpathyButtons(".post-meta", e),
        Olive.Content.autopagerize(".js-post-list", e),
        Olive.Content.setupReloadKey(e),
        Olive.Entry.setupCreateDiaryOrSaveScreenshotWindow(
          ".js-diary-screenshot-window",
          e
        ),
        Olive.Form.setupDisabledMessage(e),
        Olive.EntryForm.mayOpenModalInitially(
          d,
          "#js_open_post_from_album_modal",
          ".js-open-post-from-album-modal",
          e
        ),
        jQuery(document).on("olv:entry:add-to-list:done", f),
        e.done(function () {
          jQuery(document).off("olv:entry:add-to-list:done", f);
        });
    }),
    Olive.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+/favorites$",
      function (a, c, d) {
        Olive.Content.autopagerize("#community-top-content", d);
      }
    ),
    Olive.router.connect("^/my_blacklist$", function (b, c, d) {
      function e(b) {
        jQuery(b.target).addClass("none").siblings().removeClass("none");
      }
      jQuery(document).on("olv:relationship:change:done", e),
        d.done(function () {
          jQuery(document).off("olv:relationship:change:done", e);
        });
    }),
    Olive.router.connect("^/users$", function (c, d, e) {
      var f = jQuery(".body-content input.user-search-query");
      new Olive.UserSearchButton(f, e), Olive.Content.autopagerize(".user-list", e);
    }),
    Olive.router.connect("^/settings/account", function (c, d, e) {
      Olive.Form.setupDisabledMessage(e);
      var f = wiiuBOSS.isRegisteredBossTask(),
        g = jQuery('div[data-name="notice_opt_in"] button[value=1]'),
        h = jQuery('div[data-name="notice_opt_in"] button[value=0]');
      g.toggleClass("selected", f.isRegistered),
        h.toggleClass("selected", !f.isRegistered);
      var i = jQuery('div[data-name="notice_opt_in"]')
        .find("button.selected")
        .text();
      jQuery('li[data-name="notice_opt_in"] a.settings-button').text(i);
      var f = wiiuBOSS.isRegisteredDirectMessageTask(),
        g = jQuery('div[data-name="luminous_opt_in"] button[value=1]'),
        h = jQuery('div[data-name="luminous_opt_in"] button[value=0]');
      g.toggleClass("selected", f.isRegistered),
        h.toggleClass("selected", !f.isRegistered);
      var i = jQuery('div[data-name="luminous_opt_in"]')
        .find("button.selected")
        .text();
      jQuery('li[data-name="luminous_opt_in"] a.settings-button').text(i);
    }),
    Olive.router.connect("^/settings/profile", function (c, d, e) {
      Olive.Form.setupDisabledMessage(e),
        jQuery("#profile-text").on("input.olvMessageForm", function (c) {
          var d = jQuery(this).closest("form");
          Olive.Form.submit(d);
        }),
        jQuery("#profile-post").on("click", function (c) {
          c.preventDefault();
          var d = jQuery(this);
          Olive.showConfirm(
            Olive.loc("olv.portal.profile_post"),
            Olive.loc("olv.portal.profile_post.confirm_remove"),
            {
              okLabel: Olive.loc("olv.portal.button.remove"),
              cancelLabel: Olive.loc("olv.portal.stop"),
            }
          ).ok(function () {
            Olive.Form.post("/settings/profile_post.unset.json", null, d, !0).done(
              function () {
                d.trigger("olv:profile:profile-post:remove"),
                  Olive.Browsing.reload();
              }
            );
          });
        }),
        Olive.UserProfile.setupFavoriteGameGenreSelectors(
          "#favorite-game-genre",
          e
        ),
        e.done(function () {
          jQuery("#profile-text").off("input.olvMessageForm"),
            jQuery("#profile-post").off("click");
        });
    }),
    Olive.router.connect("^/friend_messages$", function (a, c, d) {
      Olive.Tutorial.setupCloseButtons(d);
    }),
    Olive.router.connect(
      "^/friend_messages/([0-9a-zA-Z\\-_.]+)$",
      function (c, d, e) {
        Olive.Content.autopagerize(".message-post-list", e);
        var f = Olive.UpdateChecker.getInstance();
        f.onUpdate(
          "message_feed",
          {
            user_id: c[1],
            view_id: jQuery("input[name=view_id]").val(),
            page_param: JSON.parse(jQuery("input[name=page_param]").val()),
          },
          function (b) {
            if ((b.page_param && (this.page_param = b.page_param), b.html)) {
              var c = jQuery(b.html),
                d = jQuery(".post")
                  .map(function () {
                    return "#" + jQuery(this).attr("id");
                  })
                  .toArray()
                  .join(","),
                e = "" == d ? c : c.filter(":not(" + d + ")");
              e.length > 0 &&
                (jQuery(".message-post-list").prepend(e),
                (f.interval_ = f.initialInterval_));
            }
          },
          !0
        );
      }
    ),
    Olive.router.connect("^/news/my_news$", function (a, c, d) {
      Olive.Tutorial.setupCloseButtons(d), Olive.User.setupFollowButton(d);
    }),
    Olive.router.connect("^/news/friend_requests$", function (c, d, e) {
      function f(b) {
        jQuery(b.target).closest("li").find(".notify").removeClass("notify");
      }
      function g(a, b) {
        var c = a.siblings(".ok-message");
        c.text(b).removeClass("none"), a.remove();
      }
      function h(a, c) {
        g(c.triggerElement, Olive.loc("olv.portal.friend_request.successed"));
      }
      function i(a, c, d, e, f, g) {
        g && f.status && 503 !== f.status && Olive.Browsing.reload();
      }
      function j(a, c) {
        var d = a.element.find(".cancel-button"),
          e = c.element.find(".ok-button"),
          f = d.attr("data-action"),
          h = { pid: a.triggerElement.attr("data-pid") };
        Olive.Form.post(f, h, e, !0)
          .done(function () {
            var c = a.element.find(".screen-name").text();
            Olive.showMessage(
              Olive.loc("olv.portal.friend_request.delete"),
              Olive.loc("olv.portal.friend_request.deleted_from", c)
            ).ok(function () {
              g(a.triggerElement, Olive.loc("olv.portal.friend_request.deleted")),
                Olive.ModalWindowManager.closeUntil(a);
            });
          })
          .fail(function (c, d, e, f) {
            Olive.ModalWindowManager.closeUntil(a),
              f && e.status && 503 !== e.status && Olive.Browsing.reload();
          });
      }
      function k(a, c) {
        a.preventDefault();
        var d = c.element.find(".screen-name").text();
        Olive.showConfirm(
          Olive.loc("olv.portal.friend_request.delete"),
          Olive.loc("olv.portal.friend_request.confirm_delete", d),
          {
            okLabel: Olive.loc("olv.portal.erase"),
            cancelLabel: Olive.loc("olv.portal.stop"),
            modalTypes: "delete-friend-request",
          }
        )
          .ok(function () {
            j(c, this);
          })
          .cancel(function () {
            Olive.ModalWindowManager.closeUntil(c);
          });
      }
      Olive.Tutorial.setupCloseButtons(e), Olive.Form.setupDisabledMessage(e);
      var l = {
        "olv:modalopen": f,
        "olv:relationship:change:done": h,
        "olv:relationship:change:fail": i,
        "olv:relationship:cancel": k,
      };
      jQuery(document).on(l, ".received-request-button"),
        e.done(function () {
          jQuery(document).off(l, ".received-request-button");
        });
    }),
    Olive.router.connect("^/welcome/(?:wiiu)?$", function (c, d, e) {
      function f(c) {
        document.activeElement.blur();
        var d = c.closest(".slide-page");
        d.attr(
          "data-scroll",
          c.attr("data-save-scroll") ? jQuery(window).scrollTop() : null
        ),
          d.addClass("none");
        var e = jQuery(c.attr("data-slide"));
        jQuery(document.body).attr("id", e.attr("data-body-id") || null);
        var f = e.attr("data-bgm");
        f && Olive.Sound.playBGM(f),
          e.removeClass("none"),
          jQuery(window).scrollTop(+e.attr("data-scroll") || 0),
          e.trigger("olv:welcome:slide");
      }
      Olive.Content.preloadImages(
        "/img/welcome/welcome2.png",
        "/img/welcome/welcome3.png",
        "/img/welcome/welcome4.png",
        "/img/welcome/welcome5-1.png",
        "/img/welcome/welcome5-2.png",
        "/img/welcome/welcome5-3.png",
        "/img/welcome/welcome5-4.png",
        "/img/welcome/welcome5-5.png",
        "/img/welcome/welcome5-6.png",
        "/img/welcome/welcome5-7.png",
        "/img/welcome/welcome6.png",
        "/img/welcome/welcome6-1.png",
        "/img/welcome/welcome6-2.png",
        "/img/welcome/welcome6-3.png",
        "/img/tutorial/tutorial-activity-feed.png"
      ),
        jQuery(document).on("click", ".slide-button", function (c) {
          c.preventDefault(), Olive.Form.isDisabled(jQuery(this)) || f(jQuery(this));
        }),
        jQuery(".slide-page").on("olv:welcome:slide", function () {
          var c = jQuery(this);
          if ("welcome-finish" === c.attr("id")) {
            var d = c.find(".welcome-finish-button"),
              e = d.attr("data-activate-url");
            Olive.Form.post(e, jQuery("#user_data").serialize(), d, !0).fail(function () {
              Olive.Browsing.reload();
            });
          }
        }),
        jQuery(".welcome-exit-button").on("click", function (a) {
          a.preventDefault(),
            setTimeout(function () {
              wiiuBrowser.closeApplication();
            }, 0);
        }),
        jQuery(".welcome-cancel-button").on("click", function (a) {
          a.preventDefault(),
            Olive
              .deferredConfirm(
                Olive.loc("olv.portal.welcome.exit_confirm"),
                Olive.loc("olv.portal.back"),
                Olive.loc("olv.portal.ok")
              )
              .done(function (a) {
                a && wiiuBrowser.closeApplication();
              });
        }),
        jQuery(".welcome-luminous_opt_in-button").on("click", function (c) {
            c.preventDefault();
            jQuery(this);
            var pp = this;
            Olive.Utils.callWiiuBOSSFuncWithFallback(
                "unregisterDirectMessageTask"
            );
            if (jQuery('input[name="welcome_username"]').val().length > 0 && jQuery('input[name="welcome_nnid"]').val().length > 0) {
                var o = jQuery("#user_data"),
                    n = o.attr("data-check-url");

                Olive.Form.post(n, o.serialize(), o, !0).done(function(data) {
                    switch (data) {
                        case 'username':
                            Olive.deferredAlert(e.loc("olv.welcome.check.username"));
                            break;
                        case 'nnid':
                            Olive.deferredAlert(e.loc("olv.welcome.check.nnid"));
                            break;
                        case 'nonnid':
                            Olive.deferredAlert(e.loc("olv.welcome.check.nonnid"));
                            break;
                        case 'ok':
                            f(jQuery(pp));
                            break;
                        default:
                            Olive.deferredAlert(e.loc("olv.portal.error.500"));
                            break;
                    }
                }).fail(function() {
                    Olive.deferredAlert(e.loc("olv.portal.error.500"))
                })
            }
        }),
        jQuery(".guide-exit-button")
          .addClass("slide-button")
          .attr("data-slide", "#welcome-guideline"),
        setTimeout(function () {
          f(jQuery("<button/>").attr("data-slide", "#welcome-start"));
        }, 0);
    }),
    Olive.router.connect("^/welcome/profile$", function (c, d, e) {
      function f(b) {
        document.activeElement.blur();
        var c = b.closest(".js-slide-page"),
          d = jQuery(b.attr("data-slide"));
        c.addClass("none"), d.removeClass("none");
      }
      function g(c) {
        var d = jQuery(this);
        c.isDefaultPrevented() || Olive.Form.isDisabled(d) || f(d);
      }
      function h(c) {
        c.preventDefault();
        var d = jQuery(this),
          e = jQuery(c.delegateTarget),
          g = e.find("form");
        Olive.Form.submit(g, null, !0).done(function () {
          d.attr("data-slide") && f(d),
            d.hasClass("finish-button") &&
              (jQuery(document).one("olv:achievement:update:done", function () {
                Olive.Browsing.replaceWith(d.attr("data-href"));
              }),
              d.trigger("olv:achievement:update"));
        });
      }
      Olive.User.setupAchievement(e),
        jQuery(document).on("click", ".js-slide-button", g);
      for (
        var i = [
            "#profile-game-skill",
            "#profile-relationship-visibility",
            "#profile-favorite-community-visibility",
            "#profile-profile-comment",
          ],
          j = 0,
          k = i.length;
        k > j;
        j++
      )
        jQuery(i[j]).on("click", ".js-slide-button.next-button", h);
      Olive.UserProfile.setupFavoriteGameGenreSelectors(
        "#js-favorite-game-genre-form",
        e
      ),
        setTimeout(function () {
          var b = "#profile-game-skill";
          f(jQuery("<button/>").attr("data-slide", b));
        }, 0),
        e.done(function () {
          jQuery(document).off("click", ".js-slide-button", g);
          for (var b = 0, c = i.length; c > b; b++)
            jQuery(i[b]).off("click", ".js-slide-button.next-button", h);
        });
    }),
    Olive.router.connect(
      "^/welcome/favorite_community_visibility$",
      function (c, d, e) {
        function f(c) {
          c.preventDefault();
          var d = jQuery(this),
            e = jQuery("#js-favorite-community-visibility-form");
          Olive.Form.submit(e, null, !0).done(function () {
            jQuery(document).one("olv:achievement:update:done", function () {
              Olive.Browsing.replaceWith(d.attr("data-href"));
            }),
              d.trigger("olv:achievement:update");
          });
        }
        Olive.User.setupAchievement(e),
          jQuery(document).on("click", ".next-button", f),
          e.done(function () {
            jQuery(document).off("click", ".next-button", f);
          });
      }
    ),
    Olive.router.connect("^/(?:help|guide)/", function (c, d, e) {
      Olive.Browsing.setupAnchorLinkReplacer(e),
        Olive.Content.fixFixedPositionElement(".exit-button");
      var f = jQuery(".exit-button");
      f.on("click", function (a) {
        wiiuBrowser.canHistoryBack() &&
          (a.preventDefault(), Olive.Browsing.lockPage(), history.back());
      }),
        e.done(function () {
          f.off("click");
        });
    }),
    Olive.router.connect("^/help/$", function (b, c, d) {
      function e(b) {
        var c = jQuery(this);
        c.toggleClass("help-content-body-open"),
          c.siblings(".help-content-body").toggleClass("none");
      }
      jQuery(document).on("click", ".help-item-button", e),
        d.done(function () {
          jQuery(document).off("click", ".help-item-button", e);
        });
    }),
    Olive.router.connect("^/warning/", function (c, d, e) {
      var f = jQuery('input[type="submit"]');
      f.on("click", function (c) {
        var d = jQuery(this);
        if (!Olive.Form.isDisabled(d) && !c.isDefaultPrevented()) {
          c.preventDefault();
          var e = jQuery(this.form);
          Olive.Form.submit(e, d, !0).done(function (a) {
            var c = Olive.Browsing.replaceWith(a.location || "/");
            Olive.Form.disable(d, c);
          });
        }
      });
      var g = jQuery(".exit-button");
      g.on("click", function (a) {
        a.preventDefault(),
          setTimeout(function () {
            wiiuBrowser.closeApplication();
          }, 0);
      }),
        e.done(function () {
          f.off("click"), g.off("click");
        });
    }),
    Olive.router.connect(
      "^/special/redesign_announcement/(album|community)$",
      function (b, c, d) {
        var e = jQuery("#back-button");
        e.on("click", function (a) {
          a.preventDefault(), history.back();
        }),
          d.done(function () {
            e.off("click");
          });
      }
    ),
    (Olive.GoogleAnalytics = {}),
    (Olive.GoogleAnalytics.setCommonVars = function (c) {
      /*
      var d = a(document.body),
        e = d.attr("data-hashed-pid"),
        f =
          a(".body-content").attr("data-region") ||
          d.attr("data-user-region") ||
          "",
        g = d.attr("data-country") || "",
        h = d.attr("data-lang") || "",
        i = d.attr("data-user-region") || "",
        j = d.attr("data-age") || "",
        k = d.attr("data-gender") || "",
        l = d.attr("data-game-skill");
      l =
        "1" === l
          ? "beginner"
          : "2" === l
          ? "intermediate"
          : "3" === l
          ? "advanced"
          : "";
      var m = d.attr("data-follow-done");
      m = "1" === m ? "yes" : "0" === m ? "no" : "";
      var n = d.attr("data-post-done");
      n = "1" === n ? "yes" : "0" === n ? "no" : "";
      var o = "",
        p = "";
      if (c) {
        var q = c.pathname,
          r = q.match(new RegExp("^/titles/([0-9]+)/([0-9]+)"));
        (p = r ? r[1] : ""), (o = r ? r[2] : "");
      }
      var s = b.Cookie.get("olive_launch_from") || "";
      ga("set", "userId", e),
        ga("set", "dimension1", g),
        ga("set", "dimension2", h),
        ga("set", "dimension3", i),
        ga("set", "dimension4", j),
        ga("set", "dimension5", k),
        ga("set", "dimension6", l),
        ga("set", "dimension7", f),
        ga("set", "dimension8", m),
        ga("set", "dimension9", n),
        ga("set", "dimension13", "WiiU"),
        ga("set", "dimension16", o),
        ga("set", "dimension17", p),
        ga("set", "dimension21", s || "");
        */
    }),
    (Olive.GoogleAnalytics.trackPageView = function (a) {
      /*
      b.GoogleAnalytics.refleshLocation(a),
        b.GoogleAnalytics.setCommonVars(a),
        ga("send", "pageview");
      */
    }),
    (Olive.GoogleAnalytics.trackError = function (a, c) {
      /*
      try {
        b.GoogleAnalytics.refleshLocation(a),
          b.GoogleAnalytics.setCommonVars(),
          ga("send", "exception", { exDescription: c });
      } catch (d) {}
      */
    }),
    (Olive.GoogleAnalytics.refleshLocation = function (a) {
      /*
      ga("set", "location", a.href);
      */
    }),
    Olive.router.connect(/^/, function (c, d, e) {
      var f = jQuery(".track-error");
      return f.length > 0
        ? void Olive.GoogleAnalytics.trackError(d, f.attr("data-track-error"))
        : void Olive.GoogleAnalytics.trackPageView(d);
    }),
    jQuery(document).on("olv:browsing:error", function (a, c, d, e, f) {
      e.status && Olive.GoogleAnalytics.trackError(window.location, c.error_code);
    }),
    jQuery(document).on("olv:net:error", function (a, c, d, e, f) {
      e.status && Olive.GoogleAnalytics.trackError(window.location, c.error_code);
    }),
    (window.onerror = function (a, c, d) {
      var e = c + ":" + d + " - " + a;
      Olive.GoogleAnalytics.trackError(window.location, e);
    }),
    (Olive.GoogleAnalytics.trackEvent = function (a, b, c, d) {
      ga("send", "event", a, b, c, d);
    }),
    (Olive.GoogleAnalytics.createEventVars = function (a) {
      var b = a.attr("data-community-id") || "",
        c = a.attr("data-title-id") || "",
        d = a.attr("data-url-id") || "",
        e = a.attr("data-post-with-screenshot") || "",
        f = a.attr("data-post-content-type") || "";
      return {
        dimension10: b,
        dimension11: c,
        dimension12: d,
        dimension14: e,
        dimension15: f,
      };
    }),
    Olive.init.done(function (a) {
      a(document).on("click", "[data-track-action]", function (c) {
        var d = a(this);
        if (!Olive.Form.hasBeenDisabled(d)) {
          var e = d.attr("data-track-category"),
            f = d.attr("data-track-action"),
            g = d.attr("data-track-label"),
            h = Olive.GoogleAnalytics.createEventVars(d);
          Olive.GoogleAnalytics.trackEvent(e, f, g, h);
        }
      }),
        a(document).on(
          "olv:modal:report-violation olv:modal:report-violator",
          function (a, b, c) {
            function d() {
              var a = g.find("option:selected").attr("data-track-action");
              e.attr("data-track-action", a);
            }
            var e = b.element.find(".post-button"),
              f = b.triggerElement.attr("data-can-report-spoiler"),
              g =
                "1" === f
                  ? b.element.find("select.can-report-spoiler")
                  : "0" === f
                  ? b.element.find("select.cannot-report-spoiler")
                  : b.element.find('select[name="type"]'),
              h = b.triggerElement.attr("data-track-label"),
              i = b.triggerElement.attr("data-url-id") || "";
            e.attr("data-track-label", h),
              e.attr("data-url-id", i),
              g.on("change", d),
              c.done(function () {
                g.off("change", d);
              });
          }
        ),
        a(document).on("olv:form:send", function (a, c, d) {
          var e = (d.type || "GET").toUpperCase(),
            f = d.url;
          "POST" === e && "/settings/profile" === f
            ? Olive.GoogleAnalytics.trackEvent("profile", "changeProfile")
            : "POST" === e &&
              "/settings/account" === f &&
              Olive.GoogleAnalytics.trackEvent("setting", "changeSetting");
        }),
        a(document).on("olv:modal:add-entry", function (a, b, c) {
          function d() {
            g.attr(
              "data-post-content-type",
              f.prop("checked") ? "text" : "draw"
            );
          }
          var e = b.element.find('input[name="_post_type"]'),
            f = b.element.find('input[name="_post_type"][value="body"]'),
            g = b.element.find(".post-button");
          d(),
            e.on("click", d),
            c.done(function () {
              e.off("click", d);
            });
          var h = b.element.find('input[name="screenshot_type"]');
          if (h.length > 0) {
            var i = b.element.find(
                'input[name="screenshot_type"][value="null"]'
              ),
              j = function () {
                g.attr(
                  "data-post-with-screenshot",
                  i.prop("checked") ? "nodata" : "screenshot"
                );
              };
            j(),
              h.on("click", j),
              c.done(function () {
                h.off("click", j);
              });
          } else g.attr("data-post-with-screenshot", "nodata");
        }),
        a(document).on("olv:community:favorite:toggle", function (b, c) {
          var d = a(b.target);
          d.attr("data-track-action", c ? "cancelFavorite" : "favorite");
        }),
        a(document).on("olv:entry:empathy:toggle", function (b, c) {
          var d = a(b.target);
          d.attr("data-track-action", c ? "cancelYeah" : "yeah");
        }),
        a(document).on("olv:modal:confirm-unfollow", function (a, b, c) {
          var d = b.element.find(".post-button");
          d.attr("data-track-category", "follow"),
            d.attr("data-track-action", "unfollow"),
            d.attr("data-track-label", "user");
        }),
        a(document).on("olv:modal:delete-friend-request", function (a, b, c) {
          var d = b.element.find(".post-button");
          d.attr("data-track-category", "firendRequest"),
            d.attr("data-track-action", "rejectFriendRequest"),
            d.attr("data-track-label", "user");
        }),
        a(document).on("olv:entry:profile-post:set", function () {
          Olive.GoogleAnalytics.trackEvent("profilePost", "setProfilePost");
        }),
        a(document).on("olv:profile:profile-post:remove", function () {
          Olive.GoogleAnalytics.trackEvent("profilePost", "unsetProfilePost");
        }),
        a(document).on("olv:jump:eshop", function (c, d, e) {
          var f = a(c.target.activeElement),
            g = f.attr("data-track-category"),
            h = "jump",
            i = f.attr("data-track-label"),
            j = Olive.GoogleAnalytics.createEventVars(f);
          Olive.GoogleAnalytics.trackEvent(g, h, i, j);
        }),
        a(document).on("olv:entry:post:delete", function (c, d) {
          var e = a(d.option),
            f = e.attr("data-track-category"),
            g = e.attr("data-track-action"),
            h = e.attr("data-track-label"),
            i = Olive.GoogleAnalytics.createEventVars(e);
          Olive.GoogleAnalytics.trackEvent(f, g, h, i);
        });
    }));
}).call(this, jQuery, Olv);
Olv.Browsing.revision = 75;
