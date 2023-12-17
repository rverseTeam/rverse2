var Olv = Olv || {};
(function (a, b) {
  b.init ||
    ((b.init = a
      .Deferred(function () {
        a(this.resolve);
      })
      .promise()),
    (b.Router = function () {
      (this.routes = []), (this.guard = a.Deferred());
    }),
    a.extend(b.Router.prototype, {
      connect: function (a, b) {
        a instanceof RegExp || (a = new RegExp(a)), this.routes.push([a, b]);
      },
      dispatch: function (b) {
        this.guard.resolve(b), (this.guard = a.Deferred());
        for (var c, d = b.pathname, e = 0; (c = this.routes[e]); e++) {
          var f = d.match(c[0]);
          f && c[1].call(this, f, b, this.guard.promise());
        }
      },
    }),
    (b.router = new b.Router()),
    a(document).on("pjax:end", function (c, d) {
      a(document).trigger("olv:pagechange", [d]), b.router.dispatch(location);
    }),
    b.init.done(function () {
      b.router.dispatch(location);
    }),
    b.init.done(function () {
      var a = wiiuBOSS.isRegisteredDirectMessageTask();
      a &&
        a.isRegistered &&
        b.Utils.callWiiuBOSSFuncWithFallback("registerDirectMessageTaskEx");
    }),
    (b.Locale = {
      Data: {},
      text: function (a) {
        var c = Array.prototype.slice.call(arguments);
        return c.splice(1, 0, -1), b.Locale.textN.apply(this, c);
      },
      textN: function (a, c) {
        if (b.Cookie.get("plain_msgid")) return a;
        c = +c || 0;
        var d = b.Locale.Data[a];
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
    (b.loc = b.Locale.text),
    (b.loc_n = b.Locale.textN),
    (b.print = function (a) {
      "undefined" != typeof wiiuDebug
        ? wiiuDebug.print(a)
        : "undefined" != typeof console && console.log(a);
    }),
    (b.alert = function (a, c) {
      b.Loading.isLocked() ||
        (arguments.length <= 1 && (c = b.loc("olv.portal.ok")),
        wiiuDialog.alert(a, c));
    }),
    (b.confirm = function (a, c, d) {
      return b.Loading.isLocked()
        ? void 0
        : (arguments.length <= 1 &&
            ((c = b.loc("olv.portal.cancel")), (d = b.loc("olv.portal.ok"))),
          wiiuDialog.confirm(a, c, d));
    }),
    (b.deferredAlert = function (c, d) {
      var e = arguments,
        f = a.Deferred();
      return (
        setTimeout(function () {
          b.alert.apply(null, e), f.resolve();
        }, 0),
        f.promise()
      );
    }),
    (b.deferredConfirm = function (c, d, e) {
      var f = arguments,
        g = a.Deferred();
      return (
        setTimeout(function () {
          var a = b.confirm.apply(null, f);
          g.resolve(a);
        }, 0),
        g.promise()
      );
    }),
    (b.Cookie = {
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
    (b.Loading = {
      _showCount: 0,
      show: function (b) {
        this._showCount++ || wiiuBrowser.showLoadingIcon(!0),
          b.always(
            a.proxy(function () {
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
            a.proxy(function () {
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
          b.Loading.lock(b.init),
          a(document).on("pjax:send", function (a, c) {
            b.Loading.lock(c);
          });
      },
    }),
    b.Loading.setup(),
    (b.ErrorViewer = {
      open: function (a) {
        if (!b.Loading.isLocked()) {
          a = a || {};
          var c = +(a.error_code || a.code || 0),
            d = a.message || (a.msgid && b.loc(a.msgid));
          c || ((c = 1219999), (d = d || b.loc("olv.portal.error.500"))),
            d
              ? wiiuErrorViewer.openByCodeAndMessage(c, d)
              : wiiuErrorViewer.openByCode(c);
        }
      },
      deferredOpen: function (c) {
        var d = a.Deferred();
        return (
          setTimeout(function () {
            b.ErrorViewer.open(c), d.resolve();
          }, 0),
          d.promise()
        );
      },
    }),
    (b.Net = {
      ajax: function (c) {
        var d = a.ajax(c),
          e = b.Net._pageId,
          f = d.pipe(
            function (c, d, f) {
              var g = b.Net._pageId === e,
                h = (c && "object" == typeof c && !c.success) || !g,
                i = [c, d, f, g];
              return h
                ? a.Deferred().rejectWith(this, i)
                : a.Deferred().resolveWith(this, i);
            },
            function (c, d) {
              var f = b.Net.getDataFromXHR(c);
              void 0 === f && (f = c.responseText);
              var g = b.Net._pageId === e;
              return a.Deferred().rejectWith(this, [f, d, c, g]);
            }
          );
        return (
          c.showLoading && b.Loading.show(f),
          c.lock && b.Loading.lock(f),
          c.silent || f.fail(b.Net.errorFeedbackHandler),
          f.promise(d),
          d
        );
      },
      _pageId: 1,
      onPageChange: function () {
        b.Net._pageId++;
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
        var c = b.Net.getDataFromXHR(a),
          d = c && c.errors && c.errors[0];
        if (d && "object" == typeof d) return d;
        var e = a.status;
        return e
          ? 503 == e
            ? {
                error_code: 1211503,
                message: b.loc("olv.portal.error.503.content"),
              }
            : 500 > e
            ? {
                error_code: 1210902,
                message: b.loc("olv.portal.error.failed_to_connect"),
              }
            : { error_code: 1219999, message: b.loc("olv.portal.error.500") }
          : {
              error_code: 1219998,
              message: b.loc("olv.portal.error.network_unavailable"),
            };
      },
      errorFeedbackHandler: function (c, d, e, f) {
        if ("abort" !== d && f && !b.Loading.isLocked()) {
          var g = b.Net.getErrorFromXHR(e);
          a(document).trigger("olv:net:error", [g, d, e, f]),
            b.ErrorViewer.open(g);
        }
      },
      get: function (a, c, d, e) {
        return b.Net.ajax({
          type: "GET",
          url: a,
          data: c,
          success: d,
          dataType: e,
        });
      },
      post: function (a, c, d, e) {
        return b.Net.ajax({
          type: "POST",
          url: a,
          data: c,
          success: d,
          dataType: e,
        });
      },
    }),
    a(document).on("olv:pagechange", b.Net.onPageChange),
    (b.Browsing = {
      setup: function () {
        a.pjax &&
          ((a.pjax.defaults.timeout = 0),
          (a.pjax.defaults.maxCacheLength = 5),
          (a.pjax.defaults.lockRequest = !0),
          a(document).pjax("a[href][data-pjax]"),
          a(document).on(
            "click",
            "[data-href][data-pjax]",
            this.onDataHrefClick
          ),
          a(document).on("click", "a[href][data-replace]", this.onReplaceClick),
          a(window).on("click", "a[href]", this.onLinkClickFinally),
          a(document).on("pjax:error", this.onPjaxError),
          a(document).on("olv:pagechange", this.onPageChange));
      },
      guardPage: function () {
        function b() {
          a(window).off("pagehide", b),
            a(document).off("olv:pagechange", b),
            c.resolve();
        }
        var c = a.Deferred();
        return (
          a(window).on("pagehide", b),
          a(document).on("olv:pagechange", b),
          c.promise()
        );
      },
      lockPage: function () {
        var a = b.Browsing.guardPage();
        return b.Loading.lock(a), a;
      },
      replaceWith: function (a) {
        var c = b.Browsing.lockPage();
        return location.replace(a), c;
      },
      reload: function () {
        return a.pjax
          ? a.pjax.reload("#body").promise()
          : (location.reload(), b.Browsing.guardPage());
      },
      clearCache: function () {
        a.pjax && a.pjax.clearCache();
      },
      onDataHrefClick: function (b) {
        if (!b.isDefaultPrevented() && !a(b.target).closest("a").length) {
          var c = a(this);
          c.hasClass("disabled") ||
            (a.pjax({
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
          var d = a(this).attr("href");
          setTimeout(function () {
            b.Browsing.replaceWith(d);
          }, 0);
        }
      },
      onLinkClickFinally: function (a) {
        a.isDefaultPrevented() ||
          this.href.replace(/#.*/, "") === location.href.replace(/#.*/, "") ||
          b.Browsing.lockPage();
      },
      onPjaxError: function (c, d, e, f, g) {
        if ("abort" !== e) {
          if ((c.preventDefault(), d.getResponseHeader("X-PJAX-OK")))
            return void g.success(d.responseText, e, d);
          var h = b.Net.getErrorFromXHR(d);
          setTimeout(function () {
            a(document).trigger("olv:browsing:error", [h, e, d, g]),
              b.ErrorViewer.open(h);
          }, 0),
            (g.revert = !0);
        }
      },
      revision: 1 / 0,
      expires: +new Date() + 864e5,
      onPageChange: function (a, c) {
        if (c) {
          var d = b.Browsing,
            e = +c.getResponseHeader("X-Browsing-Revision");
          (d.revision < e || d.expires < +new Date()) &&
            (b.Browsing.lockPage(), location.reload());
        }
      },
      setupAnchorLinkReplacer: function (b) {
        function c(b) {
          if (!b.isDefaultPrevented()) {
            var c = a(this),
              d = c.attr("href") || "";
            /^#.+$/.test(d) &&
              (b.preventDefault(),
              setTimeout(function () {
                location.replace(d);
              }, 0));
          }
        }
        a(document).on("click", "a[href]", c),
          b.done(function () {
            a(document).off("click", "a[href]", c);
          });
      },
    }),
    b.init.done(function () {
      b.Browsing.setup();
    }),
    (b.Utils = {}),
    (b.Utils.containsNGWords = function (a) {
      return "undefined" == typeof wiiuFilter
        ? !1
        : wiiuFilter.checkWord(a) < 0;
    }),
    (b.Utils.ERROR_CONTAINS_NG_WORDS = {
      error_code: 1215901,
      msgid: "olv.portal.contains.ng_words",
    }),
    (b.Utils.callWiiuBOSSFuncWithFallback = function (a) {
      var b = wiiuBOSS[a];
      return "registerDirectMessageTaskEx" == a
        ? "function" != typeof b
          ? wiiuBOSS.registerDirectMessageTask()
          : b.call(wiiuBOSS, 720, 2)
        : b.call(wiiuBOSS);
    }),
    (b.Content = {}),
    (b.Content.autopagerize = function (c, d) {
      function e() {
        if (
          !(
            k._disabledCount ||
            h.scrollTop() + l + 200 < f.offset().top + f.outerHeight()
          )
        ) {
          var b = a("<div/>")
            .attr("class", "post-list-loading")
            .append(
              a("<img/>").attr({ src: "/img/loading-image-green.gif", alt: "" })
            )
            .appendTo(f);
          (i = a
            .ajax({ url: g, headers: { "X-AUTOPAGERIZE": !0 } })
            .done(function (d) {
              var h = a("<div>" + d + "</div>").find(c);
              (g = h.attr("data-next-page-url") || ""),
                g || j.resolve(),
                f.trigger("olv:autopagerize", [h, g, b]),
                h.children().each(function () {
                  this.id && a("#" + this.id).length && a(this).detach();
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
      var f = a(c),
        g = f.attr("data-next-page-url");
      if (g) {
        var h = a(window),
          i = null,
          j = a.Deferred(),
          k = b.Content.autopagerize,
          l = h.height();
        h.on("scroll", e),
          j.done(function () {
            h.off("scroll", e), i && i.abort();
          }),
          setTimeout(e, 0),
          d.done(j.resolve);
      }
    }),
    (b.Content.autopagerize._disabledCount = 0),
    (b.Content.autopagerize.disable = function (a) {
      var c = b.Content.autopagerize;
      c._disabledCount++,
        a.always(function () {
          c._disabledCount--;
        });
    }),
    (b.Content.preloadImages = function () {
      for (var a = arguments.length, b = a; b--; ) {
        var c = document.createElement("img");
        c.src = arguments[b];
      }
    }),
    (b.Content.fixFixedPositionElement = function (b) {
      var c = a(b).first(),
        d = c.offset(),
        e = a(window);
      d &&
        (e.width() < d.left || e.height() < d.top) &&
        (c.css("display", "none"),
        setTimeout(function () {
          c.css("display", "");
        }, 0));
    }),
    (b.Form = {
      toggleDisabled: function (c, d) {
        var e = void 0 === d;
        return (
          c.each(function () {
            var c = a(this),
              f = e ? !b.Form.hasBeenDisabled(c) : d;
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
          b.Form.hasBeenDisabled(a) ||
          b.Form._beingDisabledNodes.indexOf(a[0]) >= 0
        );
      },
      hasBeenDisabled: function (a) {
        return a.length && "undefined" != typeof a[0].form
          ? a.prop("disabled")
          : a.hasClass("disabled");
      },
      disable: function (a, c) {
        return (
          b.Form.toggleDisabled(a, !0),
          c.always(function () {
            b.Form.toggleDisabled(a, !1);
          }),
          a
        );
      },
      disableSoon: function (a, c) {
        var d = b.Form;
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
          var d = a(this);
          if (b.Form.hasBeenDisabled(d)) {
            c.preventDefault();
            var e = d.attr("data-disabled-message");
            e && b.deferredAlert(e);
          }
        }
        a(document).on("click", "[data-disabled-message]", d),
          c.done(function () {
            a(document).off("click", "[data-disabled-message]", d);
          });
      },
      submit: function (b, c, d) {
        b.trigger("olv:form:submit", [c || a()]);
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
        var e = b.Net.ajax(c);
        return (
          a(document).trigger("olv:form:send", [e, c, d || a()]),
          d && b.Form.disableSoon(d, e),
          e
        );
      },
      updateParentClass: function (b) {
        switch (b.type) {
          case "radio":
            var c = a(
              b.form ? b.form.elements[b.name] : 'input[name="' + b.name + '"]'
            );
            c.each(function () {
              a(this).parent().toggleClass("checked", this.checked);
            });
            break;
          case "checkbox":
            a(b).parent().toggleClass("checked", b.checked);
        }
      },
      setup: function () {
        a(document).on("click", "input", function (a) {
          a.isDefaultPrevented() || b.Form.updateParentClass(this);
        });
        var c = { submit: !0, reset: !0, button: !0, image: !0, file: !0 };
        a(document).on("keypress", "input", function (b) {
          13 !== b.which ||
            b.isDefaultPrevented() ||
            this.type in c ||
            !this.form ||
            a(this.form).attr("data-allow-submission") ||
            b.preventDefault();
        }),
          a(document).on("submit", function (b) {
            b.isDefaultPrevented() ||
              a(b.target).attr("data-allow-submission") ||
              b.preventDefault();
          }),
          a(document).on("olv:form:send", function (a, c, d) {
            "POST" === (d.type || "").toUpperCase() && b.Browsing.clearCache();
          });
      },
      setupForPage: function () {
        a("input:checked").each(function () {
          b.Form.updateParentClass(this);
        });
      },
      syncSelectedText: function (a) {
        var b = a.find(":selected"),
          c = a.siblings(".select-button-content");
        c.text(b.text());
      },
    }),
    (b.Achievement = {
      requestAchieveWithoutRegard: function (b) {
        var c = a.Deferred();
        return (
          this.requestAchieve(b).always(function () {
            c.resolveWith(this, arguments);
          }),
          c.promise()
        );
      },
      requestAchieve: function (a) {
        return b.Net.ajax({
          type: "POST",
          url: "/my/achievements.json",
          contentType: "application/json",
          data: JSON.stringify({ achievements: a }),
          silent: !0,
          lock: !0,
        });
      },
    }),
    b.init.done(b.Form.setup),
    b.router.connect("", b.Form.setupForPage),
    (b.DecreasingTimer = function (a, b, c) {
      (this.callback_ = a),
        (this.initialInterval_ = b || 1e4),
        (this.maxInterval_ = c || 1 / 0),
        (this.interval_ = this.initialInterval_),
        (this.timeouts_ = []);
    }),
    (b.DecreasingTimer.prototype.resetInterval = function () {
      (this.interval_ = this.initialInterval_),
        this.clearAllTimeouts(),
        this.invoke();
    }),
    (b.DecreasingTimer.prototype.clearAllTimeouts = function () {
      a(this.timeouts_).each(
        a.proxy(function (a, b) {
          this.clearTimeout(b);
        }, this)
      );
    }),
    (b.DecreasingTimer.prototype.clearTimeout = function (a) {
      for (var b = 0, c = this.timeouts_.length; c > b; ++b)
        if (this.timeouts_[b] == a) {
          clearTimeout(this.timeouts_[b]), this.timeouts_.splice(b, 1);
          break;
        }
    }),
    (b.DecreasingTimer.prototype.invoke = function () {
      this.callback_();
      var b;
      (b = setTimeout(
        a.proxy(function () {
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
    (b.UpdateChecker = function (a, c) {
      (this._settings = {}), b.DecreasingTimer.call(this, this.callback_, a, c);
    }),
    (b.UpdateChecker.prototype = new b.DecreasingTimer()),
    (b.UpdateChecker.getInstance = function () {
      return (
        void 0 == b.UpdateChecker.instance &&
          (b.UpdateChecker.instance = new b.UpdateChecker(1e4, 6e5)),
        b.UpdateChecker.instance
      );
    }),
    (b.UpdateChecker.prototype.callback_ = function () {
      var c = {};
      a.each(
        this._settings,
        a.proxy(function (b) {
          void 0 != this._settings[b].pathname &&
          this._settings[b].pathname != location.pathname
            ? delete this._settings[b]
            : a.each(this._settings[b].params, function (a, b) {
                c[a] = JSON.stringify(b);
              });
        }, this)
      ),
        b.Net.ajax({ url: "/check_update.json", data: c, silent: !0 }).done(
          a.proxy(function (b) {
            a(this).triggerHandler("update", [b]);
          }, this)
        );
    }),
    (b.UpdateChecker.prototype.onUpdate = function (a, b, c, d) {
      (this._settings[a] = { params: b, update: c }),
        d && (this._settings[a].pathname = location.pathname);
    }),
    (b.UpdateChecker.prototype.deleteChecker = function (a) {
      delete this._settings[a];
    }),
    (b.Toggler = function (a, b) {
      (this.actions = a), (this.index = b || 0), (this.loading = null);
    }),
    a.extend(b.Toggler.prototype, {
      toggle: function (c) {
        return this.loading ||
          (0 === arguments.length && (c = this.index + 1),
          (c %= this.actions.length) === this.index)
          ? void 0
          : ((this.loading = b.Form.send({
              type: "POST",
              url: this.actions[c],
              data: this.params(c),
              context: this,
            })
              .done(function () {
                (this.index = c),
                  a(this).triggerHandler("toggledone", arguments);
              })
              .fail(function () {
                a(this).triggerHandler("togglefail", arguments);
              })
              .always(function () {
                a(this).triggerHandler("toggleend"), (this.loading = null);
              })),
            a(this).triggerHandler("togglestart"),
            this.loading);
      },
      params: function (a) {
        return [];
      },
    }),
    (b.Storage = function (a, b) {
      (this.storage = a), (this.prefix = b ? b + "." : "");
    }),
    a.extend(b.Storage.prototype, {
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
    a.extend(b.Storage, {
      _session: null,
      session: function () {
        var a = b.Storage;
        return a._session || (a._session = new a(wiiuSessionStorage, "olv"));
      },
      _local: null,
      local: function () {
        var a = b.Storage;
        return a._local || (a._local = new a(wiiuLocalStorage, "olv"));
      },
    }),
    (b.KEY_LABEL_MAP = {
      13: "A",
      27: "B",
      88: "X",
      89: "Y",
      76: "L",
      82: "R",
      80: "plus",
      77: "minus",
    }),
    (b.KeyLocker = {
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
        a.each(b.KEY_LABEL_MAP, function (a) {
          d[a] = !1;
        }),
          (c.locks = d),
          a(document).on({
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
    b.init.done(function () {
      b.KeyLocker.setup();
    }),
    (b.TriggerHandler = {
      onKeyPress: function (c) {
        13 !== c.which ||
          c.isDefaultPrevented() ||
          b.KeyLocker.isLocked(13) ||
          (c.preventDefault(), a(this).click());
      },
      onMouseUp: function (a) {
        this.blur();
      },
      setup: function () {
        a(document).on(
          { keypress: this.onKeyPress, mouseup: this.onMouseUp },
          ".trigger"
        );
      },
    }),
    b.init.done(function () {
      b.TriggerHandler.setup();
    }),
    (b.AccessKey = {
      triggerByKey: function (c) {
        var d = null;
        if (
          (a(".accesskey-" + c).each(function () {
            var c = a(this);
            return b.Form.isDisabled(c) || c.closest(".none").length
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
          var c = b.KEY_LABEL_MAP[a.which];
          if (c) {
            var d = this.triggerByKey(c);
            d && a.preventDefault();
          }
        }
      },
      bind: function (b, c, d) {
        var e = a("<button/>")
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
        a(document).on("keypress", a.proxy(this.onKeyPress, this));
      },
    }),
    b.init.done(function () {
      b.AccessKey.setup();
    }),
    (b.Sound = {
      attentionSelector:
        "a[href], [data-href], input, textarea, select, button, label, .trigger, [data-sound]",
      isAttentionTarget: function (a) {
        return !!a.closest(this.attentionSelector).length;
      },
      playAttentionSound: function (a) {
        b.Form.hasBeenDisabled(a) ||
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
        if (!b.Form.hasBeenDisabled(a)) {
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
        a(document).on("touchstart", this.attentionSelector, function () {
          b.Sound.playAttentionSound(a(this));
        }),
          a(document).on("click", this.activationSelector, function () {
            b.Sound.playActivationSound(a(this));
          });
      },
    }),
    b.init.done(function () {
      b.Sound.setup();
    }),
    b.router.connect(/^/, function (a, c, d) {
      b.Sound.setDefaultActivationSoundByPath(c.pathname),
        b.Sound.playBGMByPath(c.pathname);
    }),
    (b.Dropdown = function (b) {
      (b = a(b)),
        (this.container = b.parent()),
        (this.element = this.container.find(".dropdown-menu")),
        (this.triggerElement = b),
        (this.guard = null);
    }),
    a.extend(b.Dropdown.prototype, {
      open: function () {
        function c(c) {
          g.guard &&
            (!g.element.attr("data-sticky") ||
              (g.element[0] !== c.target &&
                !a.contains(g.element[0], c.target))) &&
            (b.Sound.isAttentionTarget(a(c.target)) ||
              b.Sound.playActivationSound(g.triggerElement),
            g.close());
        }
        function d() {
          g.guard && (b.Sound.playActivationSound(g.triggerElement), g.close());
        }
        function e() {
          g.triggerElement.attr("data-sound", "SE_WAVE_BALLOON_CLOSE"),
            a(document).on("click", c),
            a(window).on("scroll", d);
        }
        function f() {
          g.triggerElement.attr("data-sound", "SE_WAVE_BALLOON_OPEN"),
            a(document).off("click", c),
            a(window).off("scroll", d);
        }
        if (!this.guard) {
          b.Dropdown.register(this),
            this.container.addClass("open"),
            this.triggerElement.addClass("dropdown-open");
          var g = this,
            h = (this.guard = a.Deferred());
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
          b.Dropdown.unregister(this),
          this.container.removeClass("open"),
          this.triggerElement.removeClass("dropdown-open"));
      },
    }),
    a.extend(b.Dropdown, {
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
        a(document).on("click", '[data-toggle="dropdown"]', function (c) {
          if (!c.isDefaultPrevented()) {
            c.preventDefault();
            var d = a(this);
            if (!b.Form.isDisabled(d) && !d.hasClass("dropdown-open")) {
              var e = new b.Dropdown(d);
              e.open();
            }
          }
        });
      },
    }),
    b.init.done(function () {
      b.Dropdown.setup();
    }),
    (b.ModalWindowManager = {}),
    (b.ModalWindowManager._windows = []),
    (b.ModalWindowManager.currentWindow = null),
    (b.ModalWindowManager.closeAll = function () {
      for (; this.currentWindow; ) this.currentWindow.close();
    }),
    (b.ModalWindowManager.closeUntil = function (a) {
      if (a.guard)
        for (var b; (b = this.currentWindow) && (b.close(), b !== a); );
    }),
    (b.ModalWindowManager.register = function (a) {
      this._windows.push(a), (this.currentWindow = a);
    }),
    (b.ModalWindowManager.unregister = function (a) {
      if (this.currentWindow !== a)
        throw new Error("Failed to unregister modal window");
      this._windows.pop();
      var b = this._windows.length;
      this.currentWindow = b ? this._windows[b - 1] : null;
    }),
    (b.ModalWindowManager.setup = function () {
      a(document).on("click", "[data-modal-open]", function (c) {
        var d = a(this);
        if (!b.Form.isDisabled(d) && !c.isDefaultPrevented()) {
          c.preventDefault();
          var e = a.Event("olv:modalopen");
          if ((d.trigger(e), !e.isDefaultPrevented())) {
            var f = b.ModalWindowManager.createNewModal(this);
            f.open();
          }
        }
      }),
        a(document).on("click", ".olv-modal-close-button", function (a) {
          if (!a.isDefaultPrevented()) {
            a.preventDefault();
            var c = b.ModalWindowManager.currentWindow;
            c && c.close();
          }
        }),
        a(document).on("olv:modal", function (a, c, d) {
          b.Content.autopagerize.disable(d);
        });
    }),
    (b.ModalWindowManager.createNewModal = function (c) {
      var d = a(c),
        e = a(d.attr("data-modal-open"));
      e.attr("data-is-template") && (e = e.clone().removeAttr("id"));
      var f = new b.ModalWindow(e, c);
      return f;
    }),
    (b.ModalWindowManager.setupWindowPage = function (c) {
      if (!this.currentWindow) {
        var d = a(".modal-window-open");
        if (d.length) {
          var e = new b.ModalWindow(d.first());
          e.triggerOpenHandlers(c);
        }
      }
    }),
    b.init.done(function () {
      b.ModalWindowManager.setup();
    }),
    b.router.connect(/^/, function (a, c, d) {
      b.ModalWindowManager.setupWindowPage(d);
    }),
    a(document).on("olv:pagechange", function () {
      b.ModalWindowManager.closeAll();
    }),
    (b.ModalWindow = function (b, c) {
      (this.element = a(b)),
        (this.triggerElement = a(c)),
        (this.temporary = !this.element.parent().length),
        (this.prevScroll = 0),
        (this.prevContent = a());
      var d = a.trim(this.element.attr("data-modal-types"));
      (this.types = d ? d.split(/\s+/) : []), (this.guard = null);
    }),
    (b.ModalWindow.prototype.open = function () {
      return this.guard
        ? void 0
        : (document.activeElement.blur(),
          b.ModalWindowManager.register(this),
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
              return !a(this).hasClass("none");
            })
            .addClass("none")),
          window.scrollTo(0, 0),
          this.triggerOpenHandlers(a.Deferred()),
          this);
    }),
    (b.ModalWindow.prototype.triggerOpenHandlers = function (a) {
      this.guard = a;
      for (var b, c = [this, a.promise()], d = 0; (b = this.types[d]); d++)
        this.element.trigger("olv:modal:" + b, c);
      this.element.trigger("olv:modal", c);
    }),
    (b.ModalWindow.prototype.close = function () {
      return this.guard
        ? (this.guard.resolve(),
          (this.guard = null),
          b.ModalWindowManager.unregister(this),
          this.element.trigger("olv:modalclose"),
          this.temporary && this.element.remove(),
          this.element.addClass("none").removeClass("modal-window-open"),
          this.prevContent.removeClass("none"),
          window.scrollTo(0, this.prevScroll),
          (this.prevContent = a()),
          (this.prevScroll = 0),
          this)
        : void 0;
    }),
    (b.ConfirmDialog = function (c) {
      c = c || {};
      var d = a(c.template || "#confirm-dialog-template")
        .clone()
        .attr("id", "olvdialog" + new Date().getTime())
        .attr("data-modal-types", c.modalTypes || "confirm-dialog");
      b.ModalWindow.call(this, d, c.triggerElement),
        d.find(".ok-button").on(
          "click",
          a.proxy(function (b) {
            a(this).triggerHandler("dialogok", b), b.preventDefault();
          }, this)
        ),
        d.find(".cancel-button").on(
          "click",
          a.proxy(function (b) {
            a(this).triggerHandler("dialogcancel", b),
              this.close(),
              b.preventDefault();
          }, this)
        ),
        this.title(c.title)
          .body(c.body)
          .setButtonLabels({ ok: c.okLabel, cancel: c.cancelLabel });
    }),
    a.extend(b.ConfirmDialog.prototype, b.ModalWindow.prototype, {
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
        return a(this).on("dialogok", b), this;
      },
      cancel: function (b) {
        return a(this).on("dialogcancel", b), this;
      },
    }),
    (b.showConfirm = function (c, d, e) {
      return new b.ConfirmDialog(a.extend({ title: c, body: d }, e)).open();
    }),
    (b.MessageDialog = function (c) {
      b.ConfirmDialog.call(
        this,
        a.extend(c, { template: "#message-dialog-template" })
      ),
        a(this.element).on(
          "click",
          ".single-button .button",
          a.proxy(function (a) {
            this.close();
          }, this)
        );
    }),
    a.extend(b.MessageDialog.prototype, b.ConfirmDialog.prototype),
    (b.showMessage = function (c, d, e) {
      return new b.MessageDialog(a.extend({ title: c, body: d }, e)).open();
    }),
    b.router.connect("", function () {
      a("#global-menu li").removeClass("selected");
    }),
    a([
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
      b.router.connect(d[0], function () {
        a(d[1]).addClass("selected");
      });
    }),
    b.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+(?:/posts|/diary|/empathies|/friends|/followers|/following)?$",
      function () {
        var b = new RegExp(
          "^" +
            a("body").attr("data-profile-url") +
            "(?:/posts|/diary|/empathies|/friends|/followers|/following)?$"
        );
        b.test(location.pathname) &&
          a("#global-menu-mymenu").addClass("selected");
      }
    ),
    b.init.done(function (a) {
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
        b.router.connect(/^/, c),
        c();
    }),
    b.init.done(function (a) {
      if (a("#global-menu-news").length) {
        a("#global-menu-news").on("click", function (b) {
          a(b.currentTarget).find(".badge").hide();
        });
        var c = b.UpdateChecker.getInstance();
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
    a(document).on("click", ".tab-button", function (c) {
      var d = a(this);
      b.Form.isDisabled(d) ||
        d
          .addClass("selected")
          .removeClass("notify")
          .siblings()
          .removeClass("selected");
    }),
    b.init.done(function (a) {
      var c;
      try {
        c = wiiuPDM.getTitlesFilteredByPlayTime("1").IDs;
      } catch (d) {
        try {
          c = wiiuPDM.getTitlesFilteredByPlayTime(1).IDs;
        } catch (d) {}
      }
      c || (c = []),
        b.Net.ajax({
          type: "POST",
          url: "/settings/played_title_ids",
          data: c.map(function (a) {
            return { name: "title_id_hex", value: a };
          }),
          silent: !0,
        });
    }),
    b.router.connect("", function (c, d, e) {
      function f(a) {
        var c = j.scrollTop() > m;
        c !== l &&
          (k.stop().fadeToggle(a ? 0 : 300),
          b.Form.toggleDisabled(k, !c),
          (l = c));
      }
      function g(a) {
        n || f();
      }
      function h(a) {
        b.Form.isDisabled(k) ||
          a.isDefaultPrevented() ||
          (a.preventDefault(), j.scrollTop(0));
      }
      function i(a, b, c) {
        n++,
          c.done(function () {
            n--;
          });
      }
      var j = a(window),
        k = a("#scroll-to-top");
      if (k.length) {
        var l = !1,
          m = 500,
          n = 0;
        f(!0),
          j.on("scroll", g),
          k.on("click", h),
          a(document).on("olv:modal", i),
          e.done(function () {
            k.stop(!0, !0).hide(),
              j.off("scroll", g),
              k.off("click", h),
              a(document).off("olv:modal", i);
          });
      }
    }),
    b.router.connect("", function (c, d, e) {
      var f = function (b) {
        var c,
          d = a("#body .scroll").filter(":visible"),
          e = a(document.activeElement),
          f = e.closest(".scroll").filter(":visible");
        if (f.length > 0) {
          var g = d.index(f),
            h = b ? g - 1 : g + 1;
          h >= 0 && h < d.length && (c = a(d.get(h)));
        } else {
          var i = a(document).scrollTop();
          i >= document.body.scrollHeight - a(window).height()
            ? (c = b && d.length > 0 ? d.last() : null)
            : d.each(function () {
                var d = a(this),
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
        } else e.blur(), a(document).trigger("olv:keyhandler:scroll:document");
      };
      b.AccessKey.bind(
        "L",
        function () {
          f(!0);
        },
        e
      ),
        b.AccessKey.bind(
          "R",
          function () {
            f(!1);
          },
          e
        );
    }),
    (b.Content.setupReloadKey = function (a) {
      b.AccessKey.bind(
        "Y",
        function () {
          b.Browsing.reload();
        },
        a
      );
    }),
    (b.Tutorial = {}),
    (b.Tutorial.setupCloseButtons = function (c) {
      function d(c) {
        var d = a(c.target);
        if ((d.parent().hide(), d.attr("data-tutorial-name")))
          a.post("/settings/tutorial_post", {
            tutorial_name: d.attr("data-tutorial-name"),
          }).success(function () {});
        else if (d.attr("data-achievement-name")) {
          var e = d.attr("data-achievement-name").split(/\s*,\s*/);
          b.Achievement.requestAchieveWithoutRegard(e);
        }
        return c.preventDefault();
      }
      a(document).on("click", ".tutorial-close-button", d),
        c.done(function () {
          a(document).off("click", ".tutorial-close-button", d);
        });
    }),
    (b.Tutorial.setupBalloon = function (b, c) {
      function d(a) {
        return function (b) {
          a.hide();
        };
      }
      function e(c) {
        c.preventDefault();
        var d = a(c.target).closest(b),
          e = d.attr("data-balloon-target");
        if (e) {
          var f = a(e);
          f.length && f.trigger(c.type);
        }
      }
      for (var f = a(b), g = [], h = 0, i = f.length; i > h; h++) {
        var j = f.eq(h);
        if (j.attr("data-balloon-target")) {
          var k = j.attr("data-balloon-target");
          g.push([k, d(j)]);
        }
      }
      for (a(document).on("click", b, e), h = 0, i = g.length; i > h; h++)
        a(document).on("click", g[h][0], g[h][1]);
      c.done(function () {
        a(document).off("click", b, e);
        for (var c = 0, d = g.length; d > c; c++)
          a(document).off("click", g[c][0], g[c][1]);
      });
    }),
    (b.Community = {}),
    (b.Community.setupInfoTicker = function (c) {
      function d(d) {
        var h = a(this);
        b.Form.isDisabled(h) ||
          d.isDefaultPrevented() ||
          (h.attr("data-pjax")
            ? c.done(function () {
                e.remove();
              })
            : (d.preventDefault(), e.remove()),
          f.set(g, Math.floor(+new Date() / 1e3)),
          f.save(),
          e.attr("data-is-of-miiverse") &&
            a.post("/settings/miiverse_info_post"));
      }
      var e = a(".info-ticker");
      if (e.length) {
        var f = b.Storage.local().getBranch("community.info-ticker"),
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
    (b.Community.setupFavoriteButtons = function (c) {
      function d(c) {
        var d = a(this);
        if (!b.Form.isDisabled(d) && !c.isDefaultPrevented()) {
          c.preventDefault();
          var e = d.hasClass("checked");
          d.toggleClass("checked"),
            a(document.body).attr("data-is-first-favorite") &&
              !e &&
              b
                .deferredAlert(b.loc("olv.portal.confirm_first_favorite"))
                .done(function () {
                  a(document.body).removeAttr("data-is-first-favorite");
                });
          var f = d.attr(e ? "data-action-unfavorite" : "data-action-favorite");
          b.Form.post(f, null, d)
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
      a(document).on("click", ".favorite-button", d),
        c.done(function () {
          a(document).off("click", ".favorite-button", d);
        });
    }),
    (b.Community.setupUnfavoriteButtons = function (c) {
      function d(c) {
        var d = a(this);
        b.Form.isDisabled(d) ||
          (b.Form.post(d.attr("data-action"), null, d).done(function () {
            b.deferredAlert(b.loc("olv.portal.unfavorite_succeeded_to")),
              d.add(d.prev()).remove();
          }),
          c.preventDefault());
      }
      a(document).on("click", ".unfavorite-button", d),
        c.done(function () {
          a(document).off("click", ".unfavorite-button", d);
        });
    }),
    (b.Community.setupAppJumpButtons = function (c) {
      function d(c) {
        if (wiiuDevice.existsTitle) {
          for (
            var d,
              e = a(this),
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
            ? b
                .deferredConfirm(b.loc("olv.portal.confirm_app_jump"))
                .done(function (a) {
                  if (a) {
                    var b = d,
                      c = 1,
                      f = +e.attr("data-nex-community-id"),
                      g = e.attr("data-app-data");
                    wiiuBrowser.jumpToApplication(b, c, f || -1, g || "", "");
                  }
                })
            : b.deferredAlert(b.loc("olv.portal.confirm_you_have_no_soft"));
        }
      }
      a(document).on("click", ".app-jump-button", d),
        c.done(function () {
          a(document).off("click", ".app-jump-button", d);
        });
    }),
    (b.Community.setupShopButtons = function (c) {
      function d(c) {
        var d = a(this);
        b.Form.isDisabled(d) ||
          c.isDefaultPrevented() ||
          (c.preventDefault(),
          b
            .deferredConfirm(b.loc("olv.portal.confirm_open_eshop"))
            .done(function (b) {
              if (b) {
                var c = {
                  version: "1.0.0",
                  scene: "detail",
                  dst_title_id: d.attr("data-dst-title-id"),
                  src_title_id: d.attr("data-src-title-id"),
                };
                a(document).trigger("olv:jump:eshop", [c]);
                var e = a.param(c);
                wiiuBrowser.jumpToEshop(e);
              }
            }));
      }
      a(document).on("click", ".eshop-button", d),
        c.done(function () {
          a(document).off("click", ".eshop-button", d);
        });
    }),
    (b.Community.setupPostButton = function (b) {
      function c() {
        return (
          "1" === a(".tab-button.selected").attr("data-show-post-button") ||
          "1" === a(".post-headline").attr("data-show-post-button")
        );
      }
      function d() {
        var b = c();
        a("#header-post-button").toggleClass("none", !b);
      }
      d();
    }),
    (b.Community.setupURLSelector = function (b, c) {
      function d(b) {
        var c = e.val();
        c && a.pjax({ url: c, container: "#body" });
      }
      var e = a(b);
      e.on("change", d),
        c.done(function () {
          e.off("change", d);
        });
    }),
    (b.Community.setupSelectButton = function (c, d) {
      function e(a) {
        b.Form.syncSelectedText(f);
      }
      var f = a(c);
      f.on("change", e),
        d.done(function () {
          f.off("change", e);
        });
    }),
    (b.Community.setupTopicPostButton = function (c) {
      function d(c) {
        var d = a(this);
        b.Form.isDisabled(d) ||
          c.isDefaultPrevented() ||
          (c.preventDefault(),
          a(".multi_timeline-topic-filter").addClass("open"));
      }
      a(document).on("click", ".js-topic_post-header-post-button", d),
        c.done(function () {
          a(document).off("click", ".js-topic_post-header-post-button", d);
        });
    }),
    (b.parentalConfirm = function (c) {
      var d = 0,
        e = new b.ConfirmDialog({
          title: b.loc("olv.portal.parental_confirm.title"),
          body: b.loc(
            "olv.portal.parental_confirm.body",
            b.loc("olv.portal.parental_control.function." + c)
          ),
          template: "#parental-confirm-dialog-template",
        }),
        f = a(e.element).find("input.parental_code");
      return (
        e
          .ok(function (a) {
            var c = wiiuSystemSetting.checkParentalPinCode(f.val());
            f.val(""),
              c.result === !0
                ? this.close()
                : (a.preventDefault(),
                  d++,
                  b.deferredAlert(
                    b.loc(
                      "olv.portal.parental_confirm." +
                        (3 > d ? "fail_message" : "fail_many_times_message")
                    )
                  ));
          })
          .open(),
        e
      );
    }),
    b.init.done(function (a) {
      a(document.body).on("click", "[data-parental-confirm]", function (c) {
        if (!c.isDefaultPrevented()) {
          c.preventDefault();
          var d = a(this);
          b.parentalConfirm(a(c.target).attr("data-parental-confirm")).ok(
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
    a(document).on("olv:modal:select-settings", function (c, d, e) {
      d.element.on("click.olvSelectSettings", ".post-button", function (c) {
        var e = a(this);
        if (!b.Form.isDisabled(e) && !c.isDefaultPrevented()) {
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
              j = +a(this).val(),
              k = i[g][j],
              l = b.Utils.callWiiuBOSSFuncWithFallback(k);
            return l.error
              ? void b.ErrorViewer.open(l.error)
              : (e.addClass("selected"),
                e.siblings().removeClass("selected"),
                d.triggerElement.text(e.text()),
                void d.close());
          }
          var m = {};
          (m[g] = e.val()),
            b.Form.post(h, m, e, !0)
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
    a(document).on("olv:modal:title-settings", function (c, d, e) {
      var f = d.element.find(".settings-button"),
        g = f.get().map(function (b) {
          return a(b).text();
        }),
        h = d.element.find(".close-button");
      h.on("click", function (c) {
        var e = f.get().some(function (b, c) {
          return a(b).text() !== g[c];
        });
        d.close(), e && b.Browsing.reload();
      }),
        e.done(function () {
          h.off("click");
        });
    }),
    a(document).on("olv:modal:preview-body", function (b, c, d) {
      var e = [],
        f = c.element.find(
          'input[name="body"],textarea[name="body"],[data-overlaid-preview]'
        );
      f.each(function () {
        var b,
          c = a(this);
        c.attr("data-preview-class", function (a, c) {
          return (b = c || "textarea-text-preview");
        });
        var d = a("<div/>").addClass(b).insertAfter(c);
        e.push(d);
      });
      var g = function (b) {
        var d = a(b.target),
          e = d.val(),
          f = d.attr("data-preview-class"),
          g = c.element.find("." + f);
        g.text(e || d.attr("placeholder")), g.toggleClass("placeholder", !e);
      };
      f.on("input", g),
        f.trigger("input"),
        d.done(function () {
          f.off("input", g), a(e).remove();
        });
    }),
    a(document).on("olv:modal:require-body", function (b, c, d) {
      function e() {
        var b = /^\s*$/,
          c = h.length ? [h] : [g];
        return a(c).is(function () {
          return !b.test(a(this).val());
        });
      }
      function f() {
        return (
          l.filter(function () {
            return !a(this).val();
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
    (b.UserSearchButton = function (b, c) {
      (this.element = b),
        b.on(
          "input.userSearch",
          a.proxy(function (a) {
            "" !== b.val() &&
              (this.search(b.val()), b.val(""), a.preventDefault());
          }, this)
        ),
        c.done(function () {
          b.off(".userSearch");
        });
    }),
    a.extend(b.UserSearchButton.prototype, {
      search: function (b) {
        a(document).trigger("olv:usersearch:search"),
          a.pjax({
            url: "/users?query=" + encodeURIComponent(b),
            container: this.element.attr("data-pjax"),
          });
      },
    }),
    (b.TitleSearchButton = function (b, c) {
      (this.element = b),
        b.on(
          "input.titleSearch",
          a.proxy(function (a) {
            "" !== b.val() &&
              (this.search(b.val()), b.val(""), a.preventDefault());
          }, this)
        ),
        c.done(function () {
          b.off(".titleSearch");
        });
    }),
    a.extend(b.TitleSearchButton.prototype, {
      search: function (b) {
        a(document).trigger("olv:titlesearch:search"),
          a.pjax({
            url: "/titles/search?query=" + encodeURIComponent(b),
            container: this.element.attr("data-pjax"),
          });
      },
    }),
    (b.YouTubePlayer = {}),
    (b.YouTubePlayer.isApiLoaded = !1),
    (b.YouTubePlayer.setupQualityButton = function (c) {
      function d() {
        g = new YT.Player("post-video-player", {
          height: "504",
          width: "900",
          videoId: a("#post-video-player").attr("data-video-id"),
          playerVars: { rel: 0, modestbranding: 1, iv_load_policy: 3 },
          events: { onStateChange: e },
        });
      }
      function e(a) {
        a.data === YT.PlayerState.PLAYING &&
          g.setPlaybackQuality(h.prop("checked") ? "hd720" : "medium");
      }
      function f(c) {
        if (!b.Form.isDisabled(h) && !c.isDefaultPrevented()) {
          var d = h.prop("checked");
          if (
            (a
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
        h = a('#video-hd-button input[name="is_hd"]');
      if (b.YouTubePlayer.isApiLoaded) YT && d();
      else {
        var i = document.createElement("script");
        (i.src = "https://www.youtube.com/iframe_api"),
          document.getElementsByTagName("head")[0].appendChild(i),
          (window.onYouTubeIframeAPIReady = d),
          (b.YouTubePlayer.isApiLoaded = !0);
      }
      h.on("click", f),
        c.done(function () {
          h.off("click", f);
        });
    }),
    (b.User = {}),
    (b.User.setupFollowButton = function (c, d) {
      function e(c) {
        var d = a(this);
        b.Form.isDisabled(d) ||
          (b.Form.post(d.attr("data-action"), null, d).done(function (b) {
            if (
              (d.addClass("none").siblings().removeClass("none"),
              a(d).hasClass("relationship-button"))
            ) {
              var c = Array.prototype.slice.call(arguments);
              c.unshift(null), a(d).trigger("olv:relationship:change:done", c);
            }
            "following_count" in b &&
              a(d).trigger("olv:visitor:following-count:change", [
                b.following_count,
              ]);
          }),
          c.preventDefault());
      }
      function f(c, e, f, g, h, i) {
        (d.noReloadOnFollow &&
          a(c.target).hasClass("follow-button") &&
          f.can_follow_more === !0) ||
          b.Browsing.reload();
      }
      function g(a, c, d, e, f, g) {
        g && f.status && 503 !== f.status && b.Browsing.reload();
      }
      (d = a.extend({ noReloadOnFollow: !1 }, d)),
        a(document).on("click", ".toggle-button .follow-button", e),
        a(document).on(
          "olv:relationship:change:done",
          ".relationship-button",
          f
        ),
        a(document).on(
          "olv:relationship:change:fail",
          ".relationship-button",
          g
        ),
        c.done(function () {
          a(document).off("click", ".toggle-button .follow-button", e),
            a(document).off(
              "olv:relationship:change:done",
              ".relationship-button",
              f
            ),
            a(document).off(
              "olv:relationship:change:fail",
              ".relationship-button",
              g
            );
        });
    }),
    (b.User.setupAchievement = function (c) {
      function d(c) {
        var d = a(c.target),
          e = d.attr("data-achievement-name");
        e &&
          b.Achievement.requestAchieveWithoutRegard([e]).done(function (a) {
            d.trigger("olv:achievement:update:done", [a]);
          });
      }
      a(document).on("olv:achievement:update", d),
        c.done(function () {
          a(document).off("olv:achievement:update", d);
        });
    }),
    (b.UserProfile = {}),
    (b.UserProfile.setupFavoriteGameGenreSelectors = function (c, d) {
      function e(a) {
        return a
          .map(function (a) {
            return ":not(" + a + ")";
          })
          .join("");
      }
      function f(b) {
        var c = a(b),
          d = h.find("select[name=" + c.attr("name") + "]"),
          f = d.filter(e(["#" + c.attr("id")])),
          g = f.find("option[value=" + c.val() + "][data-is-configurable]"),
          i = d.find(":selected"),
          j = i
            .map(function () {
              return a(this).val();
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
        var c = a(this),
          d = c.closest("form");
        b.Form.syncSelectedText(c),
          b.Form.submit(d).done(function () {
            c.trigger("olv:profile:favorite-game-genre:change");
          }),
          f(this);
      }
      var h = a(c),
        i = h.find("select[name=favorite_game_genre]");
      i.each(function () {
        f(this);
      }),
        i.on("change", g),
        d.done(function () {
          i.off("change", g);
        });
    }),
    (b.EntryFormAlbumImageSelector = {}),
    (b.EntryFormAlbumImageSelector.setup = function (b) {
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
              var c = a(b.target);
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
      a(document).on("olv:modal:album-image-selector", d),
        b.done(function () {
          a(document).off("olv:modal:album-image-selector", d);
        });
    }),
    (b.Entry = {}),
    (b.Entry.setupHiddenContents = function (b) {
      function c(b) {
        if (!b.isDefaultPrevented()) {
          b.preventDefault();
          var c = a(this),
            d = c.closest(".hidden");
          d.removeClass("hidden"),
            d.find("[data-href-hidden]").each(function () {
              var b = a(this);
              b.attr(
                b.is("a") ? "href" : "data-href",
                b.attr("data-href-hidden")
              );
            }),
            c.closest(".hidden-content").remove();
        }
      }
      a(document).on("click", ".hidden-content-button", c),
        b.done(function () {
          a(document).off("click", ".hidden-content-button", c);
        });
    }),
    (b.Entry._loadingEmpathies = []),
    (b.Entry.toggleEmpathy = function (c) {
      var d = b.Entry._loadingEmpathies;
      if (
        d.some(function (a) {
          return a[0] === c[0];
        })
      )
        return a.Deferred().reject(null, "duplicate", null, !0);
      var e = b.Entry.isEmpathyAdded(c),
        f = c.attr("data-action");
      e && (f += ".delete");
      var g = b.Form.post(f, null, c)
        .done(function () {
          (e = !e), c.toggleClass("empathy-added", e);
          var a = c.attr("data-feeling") || "normal";
          c.text(b.loc("olv.portal.miitoo." + a + (e ? ".delete" : ""))),
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
    (b.Entry.abortLoadingEmpathies = function () {
      b.Entry._loadingEmpathies.concat().forEach(function (a) {
        a[1].abort();
      });
    }),
    a(document).on("olv:pagechange", b.Entry.abortLoadingEmpathies),
    (b.Entry.isEmpathyAdded = function (a) {
      return a.hasClass("empathy-added");
    }),
    (b.Entry.setupEmpathyButtons = function (c, d) {
      function e(d) {
        if (!d.isDefaultPrevented()) {
          d.preventDefault();
          var e = a(this);
          b.Form.isDisabled(e) ||
            b.Entry.toggleEmpathy(e).done(function () {
              var a = b.Entry.isEmpathyAdded(e),
                d = e.closest(c).find(".to-permalink-button .feeling");
              d.text(+d.text() + (a ? 1 : -1));
            });
        }
      }
      a(document).on("click", ".miitoo-button", e),
        d.done(function () {
          a(document).off("click", ".miitoo-button", e);
        });
    }),
    (b.Entry.setupPostEmpathyButton = function (c, d) {
      function e() {
        var a = b.Entry.isEmpathyAdded(g),
          c = +g.attr("data-other-empathy-count"),
          d =
            c > 0
              ? b.loc_n(
                  a
                    ? "olv.portal.empathy.you_and_n_added"
                    : "olv.portal.empathy.n_added",
                  c,
                  c
                )
              : a
              ? b.loc("olv.portal.empathy.you_added")
              : "";
        h.text(d), f.toggleClass("no-empathy", !d);
      }
      var f = a(c),
        g = f.find(".miitoo-button"),
        h = f.find(".post-permalink-feeling-text"),
        i = f.find(".post-permalink-feeling-icon-container");
      e(),
        g.on("click", function (c) {
          if (!c.isDefaultPrevented()) {
            c.preventDefault();
            var d = a(this);
            b.Form.isDisabled(d) ||
              b.Entry.toggleEmpathy(d).done(function () {
                var a = b.Entry.isEmpathyAdded(d);
                i.find(".visitor").toggle(a), i.find(".extra").toggle(!a), e();
              });
          }
        }),
        d.done(function () {
          g.off("click");
        });
    }),
    (b.Entry.setupBodyLanguageSelector = function (b) {
      function c(b) {
        var c = a(d[0].options[d[0].selectedIndex]);
        e.text(c.text());
        var f = d.val();
        a("#body-language-" + f)
          .toggleClass("none", !1)
          .siblings(".multi-language-body")
          .toggleClass("none", !0);
      }
      var d = a("#body-language-selector"),
        e = d.siblings("span.select-button-content");
      d.on("change", c),
        b.done(function () {
          d.off("change", c);
        });
    }),
    (b.Entry.setupMoreContentButton = function (c) {
      function d(b) {
        b.preventDefault();
        var c = a(b.target);
        c.prev().find(".wrapped").removeClass("none"), c.remove();
      }
      var e = a(
        ".post-subtype-default #post-permalink-body.official-user .post-content-text"
      );
      e &&
        0 != e.length &&
        (e.each(function () {
          var d = a(this),
            e = d.text().match(/([\s\S]+)(\n+---+\n[\s\S]+)/);
          if (e) {
            d.text(e[1]);
            var f = a('<span class="wrapped none"></span>').text(e[2]);
            d.append(f);
            var g = a('<a href="#" class="more-content-button"></a>');
            g.text(b.loc("olv.portal.read_more_content")),
              d.after(g),
              c.done(function () {
                g.remove();
              });
          }
        }),
        a(document).on("click", ".more-content-button", d),
        c.done(function () {
          a(document).off("click", ".more-content-button", d);
        }));
    }),
    (b.Entry.setupAppJumpButton = function (c) {
      function d(c) {
        if (wiiuDevice.existsTitle) {
          var d = a(this),
            e = d.attr("data-app-jump-title-ids").split(","),
            f = d.attr("data-title-id");
          f && e.unshift(f);
          for (var g, h = 0; h < e.length; h++)
            if (wiiuDevice.existsTitle(e[h])) {
              g = e[h];
              break;
            }
          g
            ? b
                .deferredConfirm(b.loc("olv.portal.confirm_app_jump"))
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
            : b.deferredAlert(b.loc("olv.portal.confirm_you_have_no_soft"));
        }
      }
      a(document).on("click", ".app-jump-button", d),
        c.done(function () {
          a(document).off("click", ".app-jump-button", d);
        });
    }),
    (b.Entry.setupMoreRepliesButton = function (c) {
      function d(c) {
        c.preventDefault();
        var d = a(this);
        f ||
          b.Form.isDisabled(d) ||
          (d.addClass("loading"),
          (f = b.Form.get(d.attr("href"), null, d, !0)
            .done(function (b) {
              var c = a(b);
              if (d.hasClass("all-replies-button")) {
                d.remove();
                var f = c
                  .filter(".post-permalink-reply")
                  .children()
                  .filter(function () {
                    return !a("#" + this.id).length;
                  });
                e.find(".post-permalink-reply").prepend(f);
              } else e.empty().append(c);
              d.hasClass("newer-replies-button")
                ? g.scrollTop(a("#post-permalink-comments").offset().top)
                : d.hasClass("older-replies-button") &&
                  g.scrollTop(a(document).height());
            })
            .always(function () {
              d.removeClass("loading"), (f = null);
            })));
      }
      var e = a("#post-permalink-comments"),
        f = null,
        g = a(window);
      a(document).on("click", ".more-button", d),
        c.done(function () {
          a(document).off("click", ".more-button", d), f && f.abort();
        });
    }),
    (b.Entry.mayIncrementMoreRepliesButtonCount = function (c) {
      var d = a(".oldest-replies-button, .all-replies-button");
      if (0 !== d.length && void 0 != c && 0 != c) {
        var e = +d.attr("data-reply-count");
        (e += c),
          d.text(b.loc_n("olv.portal.post.show_all_n_comments", e, e)),
          d.attr("data-reply-count", e);
      }
    }),
    (b.Entry.setupFirstPostNotice = function (c, d) {
      function e(c) {
        a(document.body).attr("data-is-first-post") &&
          !b.Form.isDisabled(a(this)) &&
          b
            .deferredAlert(b.loc("olv.portal.confirm_display_played_mark"))
            .done(function () {
              a(document.body).removeAttr("data-is-first-post"),
                a.post("/settings/struct_post").fail(function () {
                  a(document.body).attr("data-is-first-post", "1");
                });
            });
      }
      a(document).on("click", c, e),
        d.done(function () {
          a(document).off("click", c, e);
        });
    }),
    (b.Entry.setupCreateDiaryOrSaveScreenshotWindow = function (c, d) {
      function e(c) {
        var d = !1,
          e = c.find(".js-diary-screenshot-window-image-container");
        if (!e.length) return d;
        var f = e.find(".js-screenshot-capture-button");
        if (
          (f.each(function (b, c) {
            var e = a(c),
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
              i.prop("checked", !0), b.Form.updateParentClass(i.get(0));
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
        b.EntryForm.setupDiaryPostModal(c, g());
      }
      function i() {
        var c = j.find(".js-save-album"),
          d = c.find(".js-save-album-button");
        b.Form.isDisabled(d) ||
          (c.find("input[name=screenshot]").val(g()),
          event.preventDefault(),
          b.Form.submit(c, d, !0).done(function () {
            b.showConfirm(
              b.loc("olv.portal.album.save_album_image"),
              b.loc("olv.portal.album.save_album_image.confirm"),
              {
                okLabel: b.loc("olv.portal.continue_miiverse"),
                cancelLabel: b.loc("olv.portal.return_to_game"),
              }
            )
              .ok(function () {
                a.pjax({
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
      var j = a(c).eq(0);
      f(),
        a(document).on("olv:modal:add-diary-post", h),
        j.find(".js-save-album-button").on("click", i),
        d.done(function () {
          a(document).off("olv:modal:add-diary-post", h),
            j.find(".js-save-album-button").off("click", i);
        });
    }),
    a(document).on("olv:modal:capture", function (a, b, c) {
      b.element
        .find(".capture")
        .attr("src", b.triggerElement.attr("data-large-capture-url"));
    }),
    a(document).on("olv:modal:confirm-app-jump", function (a, b, c) {
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
    a(document).on("olv:modal:confirm-url", function (a, b, c) {
      var d = b.element.find(".post-button");
      d.on("click", function (a) {
        var c = b.element.find(".link-url").text();
        wiiuBrowser.jumpToBrowser(c);
      }),
        c.done(function () {
          d.off("click");
        });
    }),
    a(document).on("olv:modal:report", function (a, c, d) {
      var e = c.element.find("form"),
        f = e.find(".post-button");
      f.on("click", function (a) {
        b.Form.isDisabled(f) ||
          a.isDefaultPrevented() ||
          (a.preventDefault(),
          b.Form.submit(e, f, !0).done(function () {
            c.close(), b.Browsing.reload();
          }));
      }),
        d.done(function () {
          f.off("click");
        });
    }),
    a(document).on(
      "olv:modal:report-violator olv:modal:reply-admin-message",
      function (b, c, d) {
        function e() {
          var b = a(g[0].options[g[0].selectedIndex]);
          j.text(b.text());
          var c = !!g.val();
          h.css("display", c ? "" : "none"), i.prop("disabled", !c);
        }
        function f() {
          var b = a(g[0].options[g[0].selectedIndex]),
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
    a(document).on("olv:modal:report-violation", function (c, d, e) {
      function f() {
        var b = a(m[0].options[m[0].selectedIndex]);
        p.text(b.text());
        var c = !!m.val();
        n.css("display", c ? "" : "none");
      }
      function g() {
        var b = a(m[0].options[m[0].selectedIndex]),
          c = !!b.attr("data-body-required"),
          d = !!m.val(),
          e = (c && /^\s*$/.test(n.val())) || !d;
        o.prop("disabled", e);
      }
      var h = !!d.triggerElement.attr("data-is-post"),
        i = !!d.triggerElement.attr("data-is-message"),
        j = b.loc(
          h
            ? "olv.portal.report.report_violation"
            : i
            ? "olv.portal.report.report_violation_message"
            : "olv.portal.report.report_violation_comment",
          d.triggerElement.attr("data-screen-name")
        ),
        k = b.loc(
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
    (b.Entry.setupEditButtons = function (c) {
      function d(c) {
        var d = b.Form.post(c.action, { format: "html" }, c.button, !0).done(
          function (b) {
            a("#body").html(b);
          }
        );
        return c.modal.element.trigger("olv:entry:post:delete", c), d;
      }
      function e(c) {
        var d = b.Form.post(c.action, null, c.button, !0).done(function () {
          var b = c.modal.triggerElement.closest(
            "#post-permalink-content, #post-permalink-comments"
          );
          c.option.prop("disabled", !0);
          var d = function () {
            b.find(".spoiler-status").fadeIn(400, function () {
              a(this).addClass("spoiler");
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
          b
            .showConfirm(
              b.loc("olv.portal.profile_post"),
              b.loc("olv.portal.profile_post.confirm_update"),
              {
                okLabel: b.loc("olv.portal.profile_post.confirm_update.yes"),
                cancelLabel: b.loc("olv.portal.cancel"),
              }
            )
            .ok(function () {
              var c = this;
              c.element.find(".button").prop("disabled", !0),
                b.Form.post(a.action, null, a.button, !0).done(function () {
                  c.element.trigger("olv:entry:profile-post:set"),
                    c.close(),
                    b
                      .showConfirm(
                        b.loc("olv.portal.profile_post"),
                        b.loc("olv.portal.profile_post.done"),
                        {
                          okLabel: b.loc("olv.portal.user.search.go"),
                          cancelLabel: b.loc("olv.portal.close"),
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
          j.attr("action", c), b.Form.toggleDisabled(m, !c);
        }
        function i(a) {
          if (!b.Form.isDisabled(m) && !a.isDefaultPrevented()) {
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
      a(document).on("olv:modal:edit-post", g),
        c.done(function () {
          a(document).off("olv:modal:edit-post", g);
        });
    }),
    a(document).on("olv:modal:album-detail", function (a, c, d) {
      var e = c.element.find("form"),
        f = e.find(".js-album-delete-button");
      f.on("click", function (a) {
        b.Form.isDisabled(f) ||
          a.isDefaultPrevented() ||
          (a.preventDefault(),
          b.confirm(b.loc("olv.portal.album.delete_confirm")) &&
            b.Form.submit(e, f, !0).done(function () {
              c.close(), b.Browsing.reload();
            }));
      }),
        d.done(function () {
          f.off("click");
        });
    }),
    (b.Entry.setupCloseTopicPostButton = function (c) {
      var d = a(document).find(".js-close-topic-post-form"),
        e = d.find(".js-close-topic-post-button");
      e.on("click", function (c) {
        b.Form.isDisabled(e) ||
          c.isDefaultPrevented() ||
          (c.preventDefault(),
          b
            .showConfirm(
              b.loc("olv.portal.edit.action.close_topic_post"),
              b.loc("olv.portal.edit.action.close_topic_post.confirm"),
              {
                okLabel: b.loc("olv.portal.yes"),
                cancelLabel: b.loc("olv.portal.stop"),
              }
            )
            .ok(function () {
              b.Form.post(d.attr("action"), null, e, !0).done(function () {
                a(document)
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
    (b.EntryForm = {}),
    (b.EntryForm.setupFeelingSelector = function (a, b) {
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
    (b.EntryForm.setupSpoilerCheck = function (a, b) {
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
    (b.EntryForm.setupTopicCategories = function (a, c) {
      function d() {
        b.Form.syncSelectedText(f);
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
    (b.EntryForm.openPaintingDialog = function (b) {
      var c = a.Deferred();
      window.wiiuMemo.open(b);
      var d = setInterval(function () {
        wiiuMemo.isFinish() && (clearInterval(d), c.resolve());
      }, 40);
      return c.promise();
    }),
    (b.EntryForm.setupPostTypeChanger = function (a, c) {
      function d() {
        var a = l.prop("checked");
        k.toggleClass("active-text", a),
          k.toggleClass("active-memo", !a),
          n.prop("disabled", !a),
          o.prop("disabled", a);
      }
      function e() {
        b.EntryForm.openPaintingDialog(r).done(f),
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
            void b.deferredAlert(b.loc("olv.portal.error.memo_needs_drc")));
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
    (b.EntryForm.setupAlbumImageSelector = function (b, c) {
      var d = function (a, c, d) {
          b.find('input[name="album_image_id"]').val(c);
          var e = b.find("input.js-album-screenshot-type");
          e.attr("data-src", d).attr("checked", !0).click();
        },
        e = function (c) {
          a(c.target).hasClass("js-album-screenshot-type") ||
            b.find('input[name="album_image_id"]').val("");
        };
      a(document).on("olv:albumImageSelector:submit", d),
        b.find('input[name="screenshot_type"]').on("click", e),
        c.done(function () {
          a(document).off("olv:albumImageSelector:submit", d),
            b.find('input[name="screenshot_type"]').off("click", e);
        });
    }),
    (b.EntryForm.setupImageSelector = function (c, d) {
      function e(a, b) {
        g.prop("disabled", !a).val(a),
          h.attr("src", b || "data:image/jpeg;base64," + a);
      }
      var f = c.find(".image-selector");
      if (f.length) {
        if (f.hasClass("disabled"))
          return (
            b.EntryForm.setupForbiddenImageSelector(c, d),
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
          (a.each(i, function (a, b) {
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
          a(document.body).find("#album-image-selector").length > 0 &&
            (b.EntryForm.setupAlbumImageSelector(c, d), (j = !0)),
          !j)
        )
          return void b.EntryForm.setupForbiddenImageSelector(c, d);
        var k = f.find('input[name="screenshot_type"]');
        k.prop("disabled", !1),
          k.on("click", function (b) {
            var c = a(this),
              d = c.attr("data-value"),
              f = c.attr("data-src");
            e(d, f);
          }),
          d.done(function () {
            k.off("click");
          });
      }
    }),
    (b.EntryForm.setupForbiddenImageSelector = function (a, c) {
      function d(a) {
        a.preventDefault(),
          b.deferredAlert(b.loc("olv.portal.post.screenshot_forbidden"));
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
    (b.EntryForm.setupSubmission = function (a, c, d, e) {
      var f = c.find(".post-button");
      f.on("click", function (e) {
        if (!b.Form.isDisabled(f) && !e.isDefaultPrevented()) {
          e.preventDefault();
          var g = c.find('input[name="screenshot"]');
          return +g.attr("data-is-required-unless-forbidden") &&
            !+g.attr("data-is-capture-forbidden") &&
            g.attr("disabled") &&
            !c.find('input[name="album_image_id"]').val()
            ? void b.deferredAlert(b.loc("olv.portal.post.screenshot_required"))
            : void b.Form.submit(c, f, !0)
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
    (b.EntryForm.onAddPostDone = function (b, c) {
      var d = b.element.find("#topic_posts-form");
      if (d.length && !d.attr("data-is-identified")) {
        var e = a(c).attr("data-post-permalink-url");
        a("#add-topic-post-error-page .js-view-existing-post").attr("href", e),
          a("#header-post-button").attr(
            "data-modal-open",
            "#add-topic-post-error-page"
          );
      }
      b.close(),
        a(".js-no-content").remove(),
        a(c)
          .prependTo(a(".js-post-list"))
          .trigger("olv:entry:add-to-list:done");
    }),
    (b.EntryForm.onAddMessageDone = function (c, d) {
      c.close(),
        a(".js-no-content").remove(),
        a(".message-post-list").prepend(d);
      var e = b.UpdateChecker.getInstance();
      e.interval_ = e.initialInterval_;
    }),
    (b.EntryForm.onAddReplyDone = function (c, d) {
      b.UpdateChecker.getInstance();
      c.close();
      var e = 0;
      if (d) {
        var f = a(d),
          g = a(".post-permalink-reply li")
            .map(function () {
              return "#" + a(this).attr("id");
            })
            .toArray()
            .join(","),
          h = "" == g ? f : f.filter(":not(" + g + ")");
        h.length > 0 && (e += h.length), a(".post-permalink-reply").append(h);
      }
      b.Entry.mayIncrementMoreRepliesButtonCount(e),
        a(window).scrollTop(a(document).height());
    }),
    a(document).on("olv:modal:add-entry", function (a, c, d) {
      var e = c.element.find("form");
      b.EntryForm.setupFeelingSelector(e, d),
        b.EntryForm.setupSpoilerCheck(e, d),
        b.EntryForm.setupTopicCategories(e, d),
        b.EntryForm.setupPostTypeChanger(e, d);
    }),
    a(document).on(
      "olv:modal:open-topic-post-existing-error",
      function (a, c, d) {
        var e = function (a) {
          c.close();
        };
        b.EntryForm.getCheckCanPost(function () {}, e);
      }
    ),
    a(document).on("olv:modal:add-message", function (a, c, d) {
      var e = c.triggerElement.attr("data-user-id");
      if (e) {
        var f = c.triggerElement.attr("data-screen-name"),
          g = b.loc("olv.portal.friend_message_to", f, e);
        c.element.find(".window-title").text(g),
          c.element.find('input[name="message_to_user_id"]').val(e);
      }
    }),
    a(document).on(
      "olv:modal:add-post olv:modal:add-message",
      function (a, c, d) {
        var e = c.element.find("form"),
          f = "olv:modal:add-post" === a.type;
        f && b.EntryForm.checkCanPost(c, e),
          b.EntryForm.setupImageSelector(e, d);
        var g = f ? b.EntryForm.onAddPostDone : b.EntryForm.onAddMessageDone;
        b.EntryForm.setupSubmission(c, e, g, d);
      }
    ),
    a(document).on("olv:modal:add-reply", function (a, c, d) {
      var e = c.element.find("form");
      b.EntryForm.checkCanPost(c, e),
        b.EntryForm.setupImageSelector(e, d),
        b.EntryForm.setupSubmission(c, e, b.EntryForm.onAddReplyDone, d);
    }),
    (b.EntryForm.mayOpenModalInitially = function (c, d, e, f) {
      function g(a) {
        window.history.back();
      }
      function h(b) {
        var d = c.href.replace(/#.*/, "");
        a.pjax.state && a.pjax.state.url && (a.pjax.state.url = d),
          window.history.replaceState(a.pjax.state, "", d),
          i();
      }
      if (c.hash === d) {
        b.init.done(function () {
          var a = b.ModalWindowManager.createNewModal(e);
          a.open(),
            a.element
              .find(".olv-modal-close-button")
              .removeClass("olv-modal-close-button")
              .addClass("js-entryform-back-button");
        });
        var i = function () {
          a(document).off("click", ".js-entryform-back-button", g),
            a(document).off("olv:modalclose", ".add-post-page", h);
        };
        a(document).on("click", ".js-entryform-back-button", g),
          a(document).on("olv:modalclose", ".add-post-page", h),
          f.done(i);
      }
    }),
    (b.EntryForm.checkCanPost = function (a, c) {
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
      b.EntryForm.getCheckCanPost(e, f);
    }),
    (b.EntryForm.getCheckCanPost = function (c, d) {
      b.Net.ajax({
        type: "GET",
        url:
          "/users/" +
          a(document.body).attr("data-user-id") +
          "/check_can_post.json",
      })
        .done(function (a) {
          c(a);
        })
        .fail(function (a) {
          d(a);
        });
    }),
    (b.EntryForm.setupDiaryPostModal = function (a, b) {
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
    (b.Relationship = {}),
    (b.Relationship.isFirstFriend = function () {
      return !!a(document.body).attr("data-is-first-friend");
    }),
    (b.Relationship.confirmFirstFriend = function () {
      return b
        .deferredConfirm(b.loc("olv.portal.friend.first_request_confirm"))
        .done(function (b) {
          b && a(document.body).removeAttr("data-is-first-friend");
        })
        .promise();
    }),
    (b.Relationship.setupFirstFriendConfirm = function (c) {
      function d(c) {
        b.Relationship.isFirstFriend() &&
          (c.preventDefault(),
          b.Relationship.confirmFirstFriend().done(function (b) {
            b && a(c.target).trigger("click");
          }));
      }
      var e = '[data-modal-open="#friend-request-post-page"]';
      a(document).on("olv:modalopen", e, d),
        c.done(function () {
          a(document).off("olv:modalopen", e, d);
        });
    }),
    (b.Relationship.fillInConfirmDialog = function (a) {
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
          f.text(e || b.loc("olv.portal.friend_request.no_message"));
      }
      var g = c.attr("data-timestamp");
      void 0 !== g && d.find(".timestamp").text(g);
    }),
    (b.Relationship.setupForPage = function (a, c, d) {
      b.Relationship.isFirstFriend() &&
        b.Relationship.setupFirstFriendConfirm(d);
    }),
    b.router.connect(/^/, b.Relationship.setupForPage),
    a(document).on("olv:modal:confirm-relationship", function (c, d, e) {
      function f(b, c, e) {
        var f = c.length ? { relatedTarget: c[0] } : null,
          g = a.Event(b, f),
          h = [d];
        return (
          e && h.push.apply(h, e), i.trigger(g, h), !g.isDefaultPrevented()
        );
      }
      function g(a) {
        if (
          !b.Form.isDisabled(k) &&
          !a.isDefaultPrevented() &&
          (a.preventDefault(), f("olv:relationship:change", k))
        ) {
          var c = k.attr("data-action") || i.attr("data-action"),
            e = i.attr("data-pid"),
            g = e ? { pid: e } : null;
          b.Form.post(c, g, k, !0)
            .done(function () {
              var a = j.find(".window-title").text(),
                c = i.attr("data-screen-name"),
                e = b.loc(k.attr("data-done-msgid"), c),
                g = arguments;
              b.showMessage(a, e).ok(function () {
                var a = this.element.find(".ok-button");
                f("olv:relationship:change:done", a, g) &&
                  b.ModalWindowManager.closeUntil(d);
              });
            })
            .fail(function () {
              f("olv:relationship:change:fail", k, arguments) &&
                b.ModalWindowManager.closeUntil(d);
            });
        }
      }
      function h(a) {
        b.Form.isDisabled(l) ||
          a.isDefaultPrevented() ||
          (a.preventDefault(),
          f("olv:relationship:cancel", l) &&
            b.ModalWindowManager.closeUntil(d));
      }
      b.Relationship.fillInConfirmDialog(d);
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
    a(document).on("olv:modal:confirm-received-request", function (c, d, e) {
      function f(c, d) {
        b.Relationship.isFirstFriend() &&
          (c.preventDefault(),
          b.Relationship.confirmFirstFriend().done(function (b) {
            b ? a(c.relatedTarget).trigger("click") : d.close();
          }));
      }
      var g = d.triggerElement;
      g.on("olv:relationship:change", f),
        e.done(function () {
          g.off("olv:relationship:change", f);
        });
    }),
    a(document).on("olv:modal:post-friend-request", function (a, c, d) {
      function e(a) {
        if (!b.Form.isDisabled(g) && !a.isDefaultPrevented()) {
          a.preventDefault();
          var d = g.closest("form"),
            e = d.find("input[name=body]").val();
          return b.Utils.containsNGWords(e)
            ? void b.ErrorViewer.deferredOpen(b.Utils.ERROR_CONTAINS_NG_WORDS)
            : void b.Form.submit(d, g, !0)
                .done(function () {
                  var a = f.find(".window-title").text(),
                    d = f.find(".screen-name").text(),
                    e = b.loc("olv.portal.friend_request.send_succeeded_to", d);
                  b.showMessage(a, e).ok(function () {
                    b.ModalWindowManager.closeUntil(c), b.Browsing.reload();
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
                      (b.ModalWindowManager.closeUntil(c), b.Browsing.reload());
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
    b.init.done(function () {
      "undefined" != typeof wiiuBrowser &&
        "undefined" != typeof wiiuBrowser.endStartUp &&
        wiiuBrowser.endStartUp();
    }),
    b.router.connect("^/$", function (c, d, e) {
      function f() {
        b.Form.setupForPage(),
          b.Content.autopagerize(".js-post-list", e),
          a("#header-post-button").toggleClass("none", !1);
        var c = a("input.user-search-query");
        new b.UserSearchButton(c, e);
      }
      b.Entry.setupHiddenContents(e),
        b.Entry.setupEmpathyButtons(".post-meta", e),
        b.Content.setupReloadKey(e),
        b.Tutorial.setupCloseButtons(e),
        b.User.setupFollowButton(e);
      var g,
        h,
        i = a(".content-loading-window"),
        j = "friend" !== b.Cookie.get("view_activity_filter");
      (h = j
        ? b.Net.ajax({
            type: "GET",
            url: "/my/latest_following_related_profile_posts",
            silent: !0,
          })
        : a.Deferred().resolve().promise()),
        (g = i.length
          ? b.Net.ajax({ type: "GET", url: d.pathname + d.search, silent: !0 })
              .done(function (b) {
                var c = a(b);
                c.find("title").remove(), a("#body").html(c);
              })
              .fail(function () {
                i.remove(), a(".content-load-error-window").removeClass("none");
              })
          : a.Deferred().resolve().promise()),
        g.then(function () {
          f();
        }),
        a
          .when(g, h)
          .done(function (b, c) {
            var d = a(a.trim(c[0])),
              e = self.$(
                "[data-latest-following-relation-profile-post-placeholder]"
              ),
              f = [];
            e.each(function (b, c) {
              var e = d.get(b);
              e && (a(c).html(e), f.push(c));
            }),
              a(f).removeClass("none");
          })
          .done(function () {
            b.User.setupFollowButton(e);
          }),
        e.done(function () {
          g.abort && g.abort();
        });
    }),
    b.router.connect("^/titles/search$", function (c, d, e) {
      var f = a(".body-content input.title-search-query");
      new b.TitleSearchButton(f, e);
    }),
    b.router.connect(
      "^/communities(?:/favorites|/played)?$",
      function (c, d, e) {
        b.Tutorial.setupCloseButtons(e),
          b.Community.setupInfoTicker(e),
          b.Content.autopagerize("#community-top-content", e);
        var f = a(".body-content input.title-search-query");
        new b.TitleSearchButton(f, e);
      }
    ),
    b.router.connect("^/communities/categories/[a-z]+$", function (c, d, e) {
      b.Tutorial.setupCloseButtons(e),
        b.Content.autopagerize("#community-top-content", e);
      var f = a(".category-top-of-more");
      f.length &&
        (window.scrollTo(0, f.offset().top),
        f.removeClass("category-top-of-more"));
    }),
    b.router.connect("^/identified_user_posts$", function (a, c, d) {
      b.User.setupFollowButton(d),
        b.Content.autopagerize(".js-post-list", d),
        b.Content.setupReloadKey(d);
    }),
    b.router.connect(
      "^/titles/[0-9]+/[0-9]+(/diary|/artwork(/new|/hot)?|/topic(/new|/open)?|/new|/hot|/in_game|/old)?$",
      function (c, d, e) {
        function f(a) {
          window.scrollTo(0, 0);
        }
        b.Community.setupInfoTicker(e),
          b.Community.setupFavoriteButtons(e),
          b.Community.setupUnfavoriteButtons(e),
          b.Community.setupAppJumpButtons(e),
          b.Community.setupShopButtons(e),
          b.Community.setupPostButton(e),
          b.Community.setupURLSelector("#post-filter select", e),
          b.Community.setupSelectButton(".js-select-post-filter", e),
          b.Community.setupURLSelector(".js-select-post-filter", e),
          b.Community.setupTopicPostButton(e),
          b.Tutorial.setupBalloon(".js-tutorial-balloon", e),
          b.Entry.setupHiddenContents(e),
          b.Entry.setupEmpathyButtons(".post-meta", e),
          b.Entry.setupFirstPostNotice("#header-post-button", e),
          b.Content.autopagerize(".js-post-list", e),
          b.Content.setupReloadKey(e),
          a(".toggle-button").length && b.User.setupFollowButton(e),
          b.EntryForm.mayOpenModalInitially(
            d,
            "#js_open_post_modal",
            "#header-post-button",
            e
          ),
          b.EntryForm.mayOpenModalInitially(
            d,
            "#js_open_artwork_post_from_album_modal",
            ".js-open-artwork-post-from-album-modal",
            e
          ),
          b.EntryFormAlbumImageSelector.setup(e),
          a(document).on("olv:entry:add-to-list:done", f),
          e.done(function () {
            a(document).off("olv:entry:add-to-list:done", f);
          });
      }
    ),
    b.router.connect(/^\/posts\/([0-9A-Za-z\-_]+)$/, function (c, d, e) {
      b.Entry.setupPostEmpathyButton("#post-permalink-content", e),
        b.Entry.setupEditButtons(e),
        b.Entry.setupMoreRepliesButton(e),
        b.Entry.setupAppJumpButton(e),
        b.Entry.setupHiddenContents(e),
        b.Entry.setupFirstPostNotice("#header-reply-button", e),
        b.Entry.setupEmpathyButtons(".reply-meta", e),
        b.Entry.setupCloseTopicPostButton(e),
        b.Content.setupReloadKey(e),
        b.Form.setupDisabledMessage(e),
        b.YouTubePlayer.setupQualityButton(e),
        b.Entry.setupMoreContentButton(e),
        a("#body-language-selector").length &&
          b.Entry.setupBodyLanguageSelector(e),
        b.EntryFormAlbumImageSelector.setup(e);
    }),
    b.router.connect(/^\/replies\/([0-9A-Za-z\-_]+)$/, function (c, d, e) {
      b.Entry.setupPostEmpathyButton("#post-permalink-comments", e),
        b.Entry.setupEditButtons(e),
        a("#body-language-selector").length &&
          b.Entry.setupBodyLanguageSelector(e);
    }),
    b.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+(/empathies|/posts)$",
      function (a, c, d) {
        b.Entry.setupHiddenContents(d),
          b.Entry.setupEmpathyButtons(".post-meta", d),
          b.Content.autopagerize(".js-post-list", d),
          b.Content.setupReloadKey(d);
      }
    ),
    b.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+(/friends|/following|/followers)$",
      function (a, c, d) {
        b.Content.autopagerize("#friend-list-content", d),
          b.Content.setupReloadKey(d);
      }
    ),
    b.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+(/friends|/following|/followers|/empathies|/posts)?$",
      function (c, d, e) {
        function f(b, c) {
          a(".user-page.is-visitor .js-following-count").text(c);
        }
        b.Form.setupDisabledMessage(e),
          b.User.setupFollowButton(e, { noReloadOnFollow: !0 }),
          b.Tutorial.setupBalloon(".js-tutorial-balloon", e),
          a(document).on("olv:visitor:following-count:change", f),
          e.done(function () {
            a(document).off("olv:visitor:following-count:change", f);
          }),
          b.Entry.setupHiddenContents(e),
          b.Entry.setupEmpathyButtons(".post-meta", e);
      }
    ),
    b.router.connect("^/users/[0-9a-zA-Z\\-_.]+(/diary)$", function (c, d, e) {
      function f(b) {
        var c = a(b.target),
          d = 10;
        window.scrollTo(0, c.offset().top - d),
          c.attr("data-test-scrolled", "1");
      }
      b.Entry.setupHiddenContents(e),
        b.Entry.setupEmpathyButtons(".post-meta", e),
        b.Content.autopagerize(".js-post-list", e),
        b.Content.setupReloadKey(e),
        b.Entry.setupCreateDiaryOrSaveScreenshotWindow(
          ".js-diary-screenshot-window",
          e
        ),
        b.Form.setupDisabledMessage(e),
        b.EntryForm.mayOpenModalInitially(
          d,
          "#js_open_post_from_album_modal",
          ".js-open-post-from-album-modal",
          e
        ),
        a(document).on("olv:entry:add-to-list:done", f),
        e.done(function () {
          a(document).off("olv:entry:add-to-list:done", f);
        });
    }),
    b.router.connect(
      "^/users/[0-9a-zA-Z\\-_.]+/favorites$",
      function (a, c, d) {
        b.Content.autopagerize("#community-top-content", d);
      }
    ),
    b.router.connect("^/my_blacklist$", function (b, c, d) {
      function e(b) {
        a(b.target).addClass("none").siblings().removeClass("none");
      }
      a(document).on("olv:relationship:change:done", e),
        d.done(function () {
          a(document).off("olv:relationship:change:done", e);
        });
    }),
    b.router.connect("^/users$", function (c, d, e) {
      var f = a(".body-content input.user-search-query");
      new b.UserSearchButton(f, e), b.Content.autopagerize(".user-list", e);
    }),
    b.router.connect("^/settings/account", function (c, d, e) {
      b.Form.setupDisabledMessage(e);
      var f = wiiuBOSS.isRegisteredBossTask(),
        g = a('div[data-name="notice_opt_in"] button[value=1]'),
        h = a('div[data-name="notice_opt_in"] button[value=0]');
      g.toggleClass("selected", f.isRegistered),
        h.toggleClass("selected", !f.isRegistered);
      var i = a('div[data-name="notice_opt_in"]')
        .find("button.selected")
        .text();
      a('li[data-name="notice_opt_in"] a.settings-button').text(i);
      var f = wiiuBOSS.isRegisteredDirectMessageTask(),
        g = a('div[data-name="luminous_opt_in"] button[value=1]'),
        h = a('div[data-name="luminous_opt_in"] button[value=0]');
      g.toggleClass("selected", f.isRegistered),
        h.toggleClass("selected", !f.isRegistered);
      var i = a('div[data-name="luminous_opt_in"]')
        .find("button.selected")
        .text();
      a('li[data-name="luminous_opt_in"] a.settings-button').text(i);
    }),
    b.router.connect("^/settings/profile", function (c, d, e) {
      b.Form.setupDisabledMessage(e),
        a("#profile-text").on("input.olvMessageForm", function (c) {
          var d = a(this).closest("form");
          b.Form.submit(d);
        }),
        a("#profile-post").on("click", function (c) {
          c.preventDefault();
          var d = a(this);
          b.showConfirm(
            b.loc("olv.portal.profile_post"),
            b.loc("olv.portal.profile_post.confirm_remove"),
            {
              okLabel: b.loc("olv.portal.button.remove"),
              cancelLabel: b.loc("olv.portal.stop"),
            }
          ).ok(function () {
            b.Form.post("/settings/profile_post.unset.json", null, d, !0).done(
              function () {
                d.trigger("olv:profile:profile-post:remove"),
                  b.Browsing.reload();
              }
            );
          });
        }),
        b.UserProfile.setupFavoriteGameGenreSelectors(
          "#favorite-game-genre",
          e
        ),
        e.done(function () {
          a("#profile-text").off("input.olvMessageForm"),
            a("#profile-post").off("click");
        });
    }),
    b.router.connect("^/friend_messages$", function (a, c, d) {
      b.Tutorial.setupCloseButtons(d);
    }),
    b.router.connect(
      "^/friend_messages/([0-9a-zA-Z\\-_.]+)$",
      function (c, d, e) {
        b.Content.autopagerize(".message-post-list", e);
        var f = b.UpdateChecker.getInstance();
        f.onUpdate(
          "message_feed",
          {
            user_id: c[1],
            view_id: a("input[name=view_id]").val(),
            page_param: JSON.parse(a("input[name=page_param]").val()),
          },
          function (b) {
            if ((b.page_param && (this.page_param = b.page_param), b.html)) {
              var c = a(b.html),
                d = a(".post")
                  .map(function () {
                    return "#" + a(this).attr("id");
                  })
                  .toArray()
                  .join(","),
                e = "" == d ? c : c.filter(":not(" + d + ")");
              e.length > 0 &&
                (a(".message-post-list").prepend(e),
                (f.interval_ = f.initialInterval_));
            }
          },
          !0
        );
      }
    ),
    b.router.connect("^/news/my_news$", function (a, c, d) {
      b.Tutorial.setupCloseButtons(d), b.User.setupFollowButton(d);
    }),
    b.router.connect("^/news/friend_requests$", function (c, d, e) {
      function f(b) {
        a(b.target).closest("li").find(".notify").removeClass("notify");
      }
      function g(a, b) {
        var c = a.siblings(".ok-message");
        c.text(b).removeClass("none"), a.remove();
      }
      function h(a, c) {
        g(c.triggerElement, b.loc("olv.portal.friend_request.successed"));
      }
      function i(a, c, d, e, f, g) {
        g && f.status && 503 !== f.status && b.Browsing.reload();
      }
      function j(a, c) {
        var d = a.element.find(".cancel-button"),
          e = c.element.find(".ok-button"),
          f = d.attr("data-action"),
          h = { pid: a.triggerElement.attr("data-pid") };
        b.Form.post(f, h, e, !0)
          .done(function () {
            var c = a.element.find(".screen-name").text();
            b.showMessage(
              b.loc("olv.portal.friend_request.delete"),
              b.loc("olv.portal.friend_request.deleted_from", c)
            ).ok(function () {
              g(a.triggerElement, b.loc("olv.portal.friend_request.deleted")),
                b.ModalWindowManager.closeUntil(a);
            });
          })
          .fail(function (c, d, e, f) {
            b.ModalWindowManager.closeUntil(a),
              f && e.status && 503 !== e.status && b.Browsing.reload();
          });
      }
      function k(a, c) {
        a.preventDefault();
        var d = c.element.find(".screen-name").text();
        b.showConfirm(
          b.loc("olv.portal.friend_request.delete"),
          b.loc("olv.portal.friend_request.confirm_delete", d),
          {
            okLabel: b.loc("olv.portal.erase"),
            cancelLabel: b.loc("olv.portal.stop"),
            modalTypes: "delete-friend-request",
          }
        )
          .ok(function () {
            j(c, this);
          })
          .cancel(function () {
            b.ModalWindowManager.closeUntil(c);
          });
      }
      b.Tutorial.setupCloseButtons(e), b.Form.setupDisabledMessage(e);
      var l = {
        "olv:modalopen": f,
        "olv:relationship:change:done": h,
        "olv:relationship:change:fail": i,
        "olv:relationship:cancel": k,
      };
      a(document).on(l, ".received-request-button"),
        e.done(function () {
          a(document).off(l, ".received-request-button");
        });
    }),
    b.router.connect("^/welcome/(?:wiiu)?$", function (c, d, e) {
      function f(c) {
        document.activeElement.blur();
        var d = c.closest(".slide-page");
        d.attr(
          "data-scroll",
          c.attr("data-save-scroll") ? a(window).scrollTop() : null
        ),
          d.addClass("none");
        var e = a(c.attr("data-slide"));
        a(document.body).attr("id", e.attr("data-body-id") || null);
        var f = e.attr("data-bgm");
        f && b.Sound.playBGM(f),
          e.removeClass("none"),
          a(window).scrollTop(+e.attr("data-scroll") || 0),
          e.trigger("olv:welcome:slide");
      }
      b.Content.preloadImages(
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
        a(document).on("click", ".slide-button", function (c) {
          c.preventDefault(), b.Form.isDisabled(a(this)) || f(a(this));
        }),
        a(".slide-page").on("olv:welcome:slide", function () {
          var c = a(this);
          if ("welcome-finish" === c.attr("id")) {
            var d = c.find(".welcome-finish-button"),
              e = d.attr("data-activate-url");
            b.Form.post(e, a("#user_data").serialize(), d, !0).fail(function () {
              b.Browsing.reload();
            });
          }
        }),
        a(".welcome-exit-button").on("click", function (a) {
          a.preventDefault(),
            setTimeout(function () {
              wiiuBrowser.closeApplication();
            }, 0);
        }),
        a(".welcome-cancel-button").on("click", function (a) {
          a.preventDefault(),
            b
              .deferredConfirm(
                b.loc("olv.portal.welcome.exit_confirm"),
                b.loc("olv.portal.back"),
                b.loc("olv.portal.ok")
              )
              .done(function (a) {
                a && wiiuBrowser.closeApplication();
              });
        }),
        a(".welcome-luminous_opt_in-button").on("click", function (c) {
            c.preventDefault();
            a(this);
            var pp = this;
            b.Utils.callWiiuBOSSFuncWithFallback(
                "unregisterDirectMessageTask"
            );
            if (a('input[name="welcome_username"]').val().length > 0 && a('input[name="welcome_nnid"]').val().length > 0) {
                var o = a("#user_data"),
                    n = o.attr("data-check-url");

                b.Form.post(n, o.serialize(), o, !0).done(function(data) {
                    switch (data) {
                        case 'username':
                            b.deferredAlert(e.loc("olv.welcome.check.username"));
                            break;
                        case 'nnid':
                            b.deferredAlert(e.loc("olv.welcome.check.nnid"));
                            break;
                        case 'nonnid':
                            b.deferredAlert(e.loc("olv.welcome.check.nonnid"));
                            break;
                        case 'ok':
                            f(a(pp));
                            break;
                        default:
                            b.deferredAlert(e.loc("olv.portal.error.500"));
                            break;
                    }
                }).fail(function() {
                    b.deferredAlert(e.loc("olv.portal.error.500"))
                })
            }
        }),
        a(".guide-exit-button")
          .addClass("slide-button")
          .attr("data-slide", "#welcome-guideline"),
        setTimeout(function () {
          f(a("<button/>").attr("data-slide", "#welcome-start"));
        }, 0);
    }),
    b.router.connect("^/welcome/profile$", function (c, d, e) {
      function f(b) {
        document.activeElement.blur();
        var c = b.closest(".js-slide-page"),
          d = a(b.attr("data-slide"));
        c.addClass("none"), d.removeClass("none");
      }
      function g(c) {
        var d = a(this);
        c.isDefaultPrevented() || b.Form.isDisabled(d) || f(d);
      }
      function h(c) {
        c.preventDefault();
        var d = a(this),
          e = a(c.delegateTarget),
          g = e.find("form");
        b.Form.submit(g, null, !0).done(function () {
          d.attr("data-slide") && f(d),
            d.hasClass("finish-button") &&
              (a(document).one("olv:achievement:update:done", function () {
                b.Browsing.replaceWith(d.attr("data-href"));
              }),
              d.trigger("olv:achievement:update"));
        });
      }
      b.User.setupAchievement(e),
        a(document).on("click", ".js-slide-button", g);
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
        a(i[j]).on("click", ".js-slide-button.next-button", h);
      b.UserProfile.setupFavoriteGameGenreSelectors(
        "#js-favorite-game-genre-form",
        e
      ),
        setTimeout(function () {
          var b = "#profile-game-skill";
          f(a("<button/>").attr("data-slide", b));
        }, 0),
        e.done(function () {
          a(document).off("click", ".js-slide-button", g);
          for (var b = 0, c = i.length; c > b; b++)
            a(i[b]).off("click", ".js-slide-button.next-button", h);
        });
    }),
    b.router.connect(
      "^/welcome/favorite_community_visibility$",
      function (c, d, e) {
        function f(c) {
          c.preventDefault();
          var d = a(this),
            e = a("#js-favorite-community-visibility-form");
          b.Form.submit(e, null, !0).done(function () {
            a(document).one("olv:achievement:update:done", function () {
              b.Browsing.replaceWith(d.attr("data-href"));
            }),
              d.trigger("olv:achievement:update");
          });
        }
        b.User.setupAchievement(e),
          a(document).on("click", ".next-button", f),
          e.done(function () {
            a(document).off("click", ".next-button", f);
          });
      }
    ),
    b.router.connect("^/(?:help|guide)/", function (c, d, e) {
      b.Browsing.setupAnchorLinkReplacer(e),
        b.Content.fixFixedPositionElement(".exit-button");
      var f = a(".exit-button");
      f.on("click", function (a) {
        wiiuBrowser.canHistoryBack() &&
          (a.preventDefault(), b.Browsing.lockPage(), history.back());
      }),
        e.done(function () {
          f.off("click");
        });
    }),
    b.router.connect("^/help/$", function (b, c, d) {
      function e(b) {
        var c = a(this);
        c.toggleClass("help-content-body-open"),
          c.siblings(".help-content-body").toggleClass("none");
      }
      a(document).on("click", ".help-item-button", e),
        d.done(function () {
          a(document).off("click", ".help-item-button", e);
        });
    }),
    b.router.connect("^/warning/", function (c, d, e) {
      var f = a('input[type="submit"]');
      f.on("click", function (c) {
        var d = a(this);
        if (!b.Form.isDisabled(d) && !c.isDefaultPrevented()) {
          c.preventDefault();
          var e = a(this.form);
          b.Form.submit(e, d, !0).done(function (a) {
            var c = b.Browsing.replaceWith(a.location || "/");
            b.Form.disable(d, c);
          });
        }
      });
      var g = a(".exit-button");
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
    b.router.connect(
      "^/special/redesign_announcement/(album|community)$",
      function (b, c, d) {
        var e = a("#back-button");
        e.on("click", function (a) {
          a.preventDefault(), history.back();
        }),
          d.done(function () {
            e.off("click");
          });
      }
    ),
    (b.GoogleAnalytics = {}),
    (b.GoogleAnalytics.setCommonVars = function (c) {
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
    (b.GoogleAnalytics.trackPageView = function (a) {
      /*
      b.GoogleAnalytics.refleshLocation(a),
        b.GoogleAnalytics.setCommonVars(a),
        ga("send", "pageview");
      */
    }),
    (b.GoogleAnalytics.trackError = function (a, c) {
      /*
      try {
        b.GoogleAnalytics.refleshLocation(a),
          b.GoogleAnalytics.setCommonVars(),
          ga("send", "exception", { exDescription: c });
      } catch (d) {}
      */
    }),
    (b.GoogleAnalytics.refleshLocation = function (a) {
      /*
      ga("set", "location", a.href);
      */
    }),
    b.router.connect(/^/, function (c, d, e) {
      var f = a(".track-error");
      return f.length > 0
        ? void b.GoogleAnalytics.trackError(d, f.attr("data-track-error"))
        : void b.GoogleAnalytics.trackPageView(d);
    }),
    a(document).on("olv:browsing:error", function (a, c, d, e, f) {
      e.status && b.GoogleAnalytics.trackError(window.location, c.error_code);
    }),
    a(document).on("olv:net:error", function (a, c, d, e, f) {
      e.status && b.GoogleAnalytics.trackError(window.location, c.error_code);
    }),
    (window.onerror = function (a, c, d) {
      var e = c + ":" + d + " - " + a;
      b.GoogleAnalytics.trackError(window.location, e);
    }),
    (b.GoogleAnalytics.trackEvent = function (a, b, c, d) {
      ga("send", "event", a, b, c, d);
    }),
    (b.GoogleAnalytics.createEventVars = function (a) {
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
    b.init.done(function (a) {
      a(document).on("click", "[data-track-action]", function (c) {
        var d = a(this);
        if (!b.Form.hasBeenDisabled(d)) {
          var e = d.attr("data-track-category"),
            f = d.attr("data-track-action"),
            g = d.attr("data-track-label"),
            h = b.GoogleAnalytics.createEventVars(d);
          b.GoogleAnalytics.trackEvent(e, f, g, h);
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
            ? b.GoogleAnalytics.trackEvent("profile", "changeProfile")
            : "POST" === e &&
              "/settings/account" === f &&
              b.GoogleAnalytics.trackEvent("setting", "changeSetting");
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
          b.GoogleAnalytics.trackEvent("profilePost", "setProfilePost");
        }),
        a(document).on("olv:profile:profile-post:remove", function () {
          b.GoogleAnalytics.trackEvent("profilePost", "unsetProfilePost");
        }),
        a(document).on("olv:jump:eshop", function (c, d, e) {
          var f = a(c.target.activeElement),
            g = f.attr("data-track-category"),
            h = "jump",
            i = f.attr("data-track-label"),
            j = b.GoogleAnalytics.createEventVars(f);
          b.GoogleAnalytics.trackEvent(g, h, i, j);
        }),
        a(document).on("olv:entry:post:delete", function (c, d) {
          var e = a(d.option),
            f = e.attr("data-track-category"),
            g = e.attr("data-track-action"),
            h = e.attr("data-track-label"),
            i = b.GoogleAnalytics.createEventVars(e);
          b.GoogleAnalytics.trackEvent(f, g, h, i);
        });
    }));
}).call(this, jQuery, Olv);
Olv.Browsing.revision = 75;
