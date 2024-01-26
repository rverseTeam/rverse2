var Olv = Olv || {};
(function(Olive) {
    Olive.init || (Olive.init = !0, $(function() {
        cave.transition_end(), cave.toolbar_enableBackBtnFunc(!1), Olive.router = new Olive.Router, Olive.Pjax.start(), Backbone.history.checkUrl = function(t) {
            Olive.History.needToSetState && (history.state = t.state), Backbone.History.prototype.checkUrl.call(Backbone.history, t)
        }, Backbone.history.start({
            pushState: !0,
            root: "/",
            silent: !0
        }), Olive.router.navigate(location.pathname + location.search, {
            trigger: !0
        }), Olive.OneTime.update(), Olive.ImageViewer.setup()
    }), Olive.Locale = {
        Data: {},
        text: function(t) {
            var i = Array.prototype.slice.call(arguments);
            return i.splice(1, 0, -1), Olive.Locale.textN.apply(this, i)
        },
        textN: function(t, i) {
            if (Olive.Cookie.get("plain_msgid")) return t;
            i = +i || 0;
            var o = Olive.Locale.Data[t];
            if (!o) return t;
            var n, a, s = o.quanttype || "o";
            if ("1_o" === s && 1 === i || "01_o" === s && (0 === i || 1 === i) ? (n = o.text_value_1 || o.value_1, a = o.text_args_1 || o.args_1) : (n = o.text_value || o.value, a = o.text_args || o.args), !a) return n;
            var r = Array.prototype.slice.call(arguments, 2),
                l = 0;
            return n.replace(/%s/g, function() {
                return r[a[l++] - 1]
            })
        }
    }, Olive.loc = Olive.Locale.text, Olive.loc_n = Olive.Locale.textN, Olive.alert = function(t, i, o) {
        Olive.Loading.isLocked() || (arguments.length <= 2 && (o = Olive.loc("olv.portal.n3ds.ok")), o = String.fromCharCode(57344) + " " + o, cave.dialog_oneButton(t, i, o))
    }, Olive.confirm = function(t, i, o, n) {
        if (!Olive.Loading.isLocked()) {
            arguments.length <= 2 && (o = Olive.loc("olv.portal.cancel"), n = Olive.loc("olv.portal.n3ds.ok")), n = String.fromCharCode(57344) + " " + n, o = String.fromCharCode(57345) + " " + o;
            var a = cave.dialog_twoButton(t, i, o, n);
            return 1 === a || 0 !== a && null
        }
    }, Olive.deferredAlert = function(t, i, o) {
        var n = arguments,
            a = $.Deferred();
        return setTimeout(function() {
            Olive.alert.apply(null, n), a.resolve()
        }, 0), a.promise()
    }, Olive.deferredConfirm = function(t, i, o, n) {
        var a = arguments,
            s = $.Deferred();
        return setTimeout(function() {
            var t = Olive.confirm.apply(null, a);
            s.resolve(t)
        }, 0), s.promise()
    }, Olive.PostStorage = {
        maxLocalStorageNum: 3,
        getAll: function() {
            for (var e = {}, t = cave.lls_getCount(), i = new RegExp("^[0-9]+$"), o = 0, n = 0; n < t; n++) {
                var a = cave.lls_getKeyAt(n);
                i.test(a) && (e[a] = cave.lls_getItem(a), o += 1)
            }
            return [e, o]
        },
        getCount: function() {
            return Olive.PostStorage.getAll()[1]
        },
        setItem: function(e) {
            var t = (new Date).getTime();
            cave.lls_setItem(String(t), e)
        },
        removeItem: function(e) {
            var t = JSON.parse(cave.lls_getItem(e));
            t && t.screenShotKey && cave.lls_removeItem(t.screenShotKey), cave.lls_removeItem(e)
        },
        hasKey: function(e) {
            for (var t = cave.lls_getCount(), i = 0; i < t; i++)
                if (e === cave.lls_getKeyAt(i)) return !0;
            return !1
        },
        sweep: function() {
            var t = Olive.PostStorage.getAll(),
                i = t[0];
            if (t[1] > 0)
                for (var o in i) {
                    var n = JSON.parse(cave.lls_getItem(o)).screenShotKey;
                    n && !Olive.PostStorage.hasKey(n) && cave.lls_removeItem(o)
                }
        }
    }, Olive.Cookie = {
        set: function(e, t) {
            var i = encodeURIComponent(e) + "=" + encodeURIComponent(t) + "; path=/";
            document.cookie = i
        },
        get: function(e) {
            if (e && document.cookie)
                for (var t = document.cookie.split("; "), i = 0; i < t.length; i++) {
                    var o = t[i].split("=");
                    if (e === decodeURIComponent(o[0])) return decodeURIComponent(o[1])
                }
        }
    }, Olive.OneTime = {
        updateLocalList: function() {
            var t = $("#body").attr("data-region-id");
            t && Olive.Net.ajax({
                url: "/local_list.json?region_id=" + t,
                silent: !0,
                cache: !1
            }).done(function(e) {
                console.log(e.local_list), cave.lls_setItem("CaveLocalList", e.local_list), cave.capture_notifyUpdatedLocalList(), console.log(cave.lls_getItem("CaveLocalList"))
            })
        },
        updateUseTokenCache: function() {
            cave.ls_canUseCachedServiceToken() || cave.ls_setCanUseCachedServiceToken(!0)
        },
        clearBossLuminous: function() {
            cave.boss_clearNewArrival(), cave.boss_isRegisted() && cave.boss_registEx(1, 336)
        },
        updateAgreeOlvFlag: function() {
            /^\/(?:welcome\/|warning\/device_ban)/.test(location.pathname) || cave.lls_setItem("agree_olv", "1")
        },
        updatePlayedTitles: function() {
            if (!Olive.Guest.isGuest()) {
                var t = void 0,
                    i = cave.plog_getPlayTitlesFilteredByPlayTime(1);
                void 0 !== i && (t = JSON.parse(i).IDs), t && t.length && Olive.Net.ajax({
                    type: "POST",
                    url: "/settings/played_title_ids",
                    data: t.map(function(e) {
                        return {
                            name: "title_id_hex",
                            value: e
                        }
                    }),
                    silent: !0
                })
            }
        },
        activateCommunityToolbar: function() {
            "/communities" === location.pathname && Olive.Toolbar.activateButton(Olive.Toolbar.buttons.COMMUNITY)
        },
        update: function() {
            Olive.Cookie.get("onetime") || (Olive.Cookie.set("onetime", !0), this.updateLocalList(), this.updateUseTokenCache(), this.clearBossLuminous(), this.updateAgreeOlvFlag(), this.updatePlayedTitles(), this.activateCommunityToolbar())
        }
    }, Olive.Loading = {
        locked_: !1,
        lock: function() {
            this.locked_ || (this.locked_ = !0, cave.transition_begin())
        },
        unlock: function() {
            this.locked_ && (cave.transition_end(), this.locked_ = !1)
        },
        isLocked: function() {
            return this.locked_
        },
        setup: function() {
            $(document).on("olv:pagechange:start olv:pjax:start", function(t, i) {
                Olive.Loading.lock(), cave.brw_notifyPageMoving()
            }), $(document).on("olv:pagechange:end olv:pjax:error", function() {
                Olive.router.lockRequest = !1, Olive.Loading.unlock()
            })
        }
    }, Olive.Loading.setup(), Olive.ErrorViewer = {
        open: function(t) {
            if (!Olive.Loading.isLocked()) {
                var i = +((t = t || {}).error_code || t.code || 0),
                    o = t.message || t.msgid && Olive.loc(t.msgid);
                i || (i = 1219999, o = o || Olive.loc("olv.portal.error.500.for_n3ds")), o ? cave.error_callFreeErrorViewer(i, o) : cave.error_callErrorViewer(i)
            }
        },
        deferredOpen: function(t) {
            var i = $.Deferred();
            return setTimeout(function() {
                Olive.ErrorViewer.open(t), i.resolve()
            }, 0), i.promise()
        }
    }, Olive.Net = {
        ajax: function(t) {
            "POST" === (t.method || t.type || "").toUpperCase() && Olive.Net.needsPostFix && (history.pushState(history.state, document.title, location.href), cave.history_removeAt(0), Olive.Net.needsPostFix = !1);
            var i = $.ajax(t),
                o = history.state && history.state.id || 0,
                n = i.then(function(e, t, i) {
                    var n = history.state.id === o,
                        a = [e, t, i, n];
                    return e && "object" == typeof e && !e.success || !n ? $.Deferred().rejectWith(this, a) : $.Deferred().resolveWith(this, a)
                }, function(t, i) {
                    var n = Olive.Net.getDataFromXHR(t);
                    void 0 === n && (n = t.responseText);
                    var a = history.state.id === o;
                    return $.Deferred().rejectWith(this, [n, i, t, a])
                });
            return t.lock && (Olive.Loading.lock(), n.always(function() {
                Olive.Loading.unlock()
            })), t.silent || n.fail(Olive.Net.errorFeedbackHandler), n.promise(i), i
        },
        getDataFromXHR: function(e) {
            var t = e.responseText,
                i = e.getResponseHeader("Content-Type");
            if (t && i && /^application\/json(?:;|$)/.test(i)) try {
                return JSON.parse(t)
            } catch (e) {}
        },
        getErrorFromXHR: function(t) {
            var i = Olive.Net.getDataFromXHR(t),
                o = i && i.errors && i.errors[0];
            if (o && "object" == typeof o) return o;
            var n = t.status;
            return n ? 503 == n ? {
                error_code: 1211503,
                message: Olive.loc("olv.portal.error.503.content")
            } : n < 500 ? {
                error_code: 1210902,
                message: Olive.loc("olv.portal.error.failed_to_connect")
            } : {
                error_code: 1219999,
                message: Olive.loc("olv.portal.error.500.for_n3ds")
            } : {
                error_code: 1219998,
                message: Olive.loc("olv.portal.error.network_unavailable")
            }
        },
        errorFeedbackHandler: function(t, i, o, n) {
            if ("abort" !== i && n && !Olive.Loading.isLocked()) {
                var a = Olive.Net.getErrorFromXHR(o);
                Olive.ErrorViewer.open(a)
            }
        },
        get: function(t, i, o, n) {
            return Olive.Net.ajax({
                type: "GET",
                url: t,
                data: i,
                success: o,
                dataType: n
            })
        },
        post: function(t, i, o, n) {
            return Olive.Net.ajax({
                type: "POST",
                url: t,
                data: i,
                success: o,
                dataType: n
            })
        },
        needsPostFix: !0,
        _pageId: 1,
        onPageChange: function() {
            Olive.Net._pageId++, Olive.Net.needsPostFix = !0
        }
    }, $(document).on("olv:pagechange:end", Olive.Net.onPageChange), Olive.Pjax = {
        isEnabled: !1,
        cacheMapping_: {},
        stack_: [],
        current_: -1,
        maxCacheLength: 3,
        start: function() {
            $(document).on("click", "a[href][data-pjax]", function(t) {
                t.preventDefault();
                var i = $(t.currentTarget);
                if (!Olive.Form.isDisabled(i)) {
                    var o = $(this).attr("href");
                    Olive.router.navigate(o, {
                        trigger: !0,
                        replace: !!$(this).attr("data-pjax-replace")
                    })
                }
            }), Olive.Pjax.isEnabled = !0
        },
        load: function(t) {
            $(document).trigger("olv:pjax:start");
            var i = new Date;
            console.log("olv:pjax:start");
            var o = function(t, o, n) {
                    var a = n.getResponseHeader("X-PJAX-PATH");
                    if (a && history.state.url !== a) {
                        var s = _.extend({}, history.state, {
                            url: a
                        });
                        window.history.replaceState(s, null, a), Olive.History.needToSetState && (history.state = s)
                    }
                    $(document).trigger("olv:pjax:end");
                    var r = new Date - i;
                    console.log("olv:pjax:end " + r), Olive.Content.replaceBody(t), $(document).trigger("olv:pagechange:ready");
                    var l = new Date - i;
                    return console.log("olv:pagechange:ready " + l), setTimeout(function() {
                        var e = new Date - i;
                        console.log("olv:pagechange:end " + e), $(document).trigger("olv:pagechange:end", [
                            [r, l, e]
                        ])
                    }, 0), $.Deferred().resolveWith(this, arguments)
                },
                n = Olive.Net.ajax({
                    url: t,
                    data: {
                        _pjax: 1
                    },
                    headers: {
                        "X-PJAX": "true",
                        "X-PJAX-Container": "#body"
                    },
                    silent: !0
                });
            return n.then(o, function(t, i, n) {
                if (n.getResponseHeader("X-PJAX-OK")) return o.apply(this, arguments);
                $(document).trigger("olv:pjax:error");
                var a = Olive.Net.getErrorFromXHR(n);
                return Olive.ErrorViewer.open(a), $.Deferred().rejectWith(this, arguments)
            }).promise(n), n
        },
        cachePush: function(t, i) {
            for (Olive.Pjax.cacheMapping_[t] = i, ++Olive.Pjax.current_; Olive.Pjax.current_ < Olive.Pjax.stack_.length;) delete Olive.Pjax.cacheMapping_[Olive.Pjax.stack_.pop()];
            Olive.Pjax.stack_.push(t);
            for (var o = 0; o < Olive.Pjax.stack_.length - Olive.Pjax.maxCacheLength; o++) Olive.Pjax.cacheMapping_[Olive.Pjax.stack_[o]] = void 0
        },
        cachePop: function(t) {
            "forward" === t ? ++Olive.Pjax.current_ : --Olive.Pjax.current_;
            var i = Olive.Pjax.stack_[Olive.Pjax.current_];
            return Olive.Pjax.cacheMapping_[i]
        },
        cacheSet: function(t) {
            var i = Olive.Pjax.stack_[Olive.Pjax.current_];
            Olive.Pjax.cacheMapping_[i] = t
        },
        cacheReplace: function(t, i) {
            delete Olive.Pjax.cacheMapping_[Olive.Pjax.stack_[Olive.Pjax.current_]], Olive.Pjax.stack_[Olive.Pjax.current_] = t, Olive.Pjax.cacheMapping_[t] = i
        },
        canGo: function(t) {
            if (!t || "replace" === t) return !1;
            var i = "forward" === t ? 1 : -1,
                o = Olive.Pjax.stack_[Olive.Pjax.current_ + i];
            return !!o && history.state.id == o
        },
        go: function(t, i) {
            var o = i.direction,
                n = i.cacheId || history.state.id,
                a = history.state && history.state.scrollTo || 0;
            if ($(document).trigger("olv:pagechange:start"), !o || o && "back" !== o && !Olive.Pjax.canGo(o)) return Olive.Pjax.load(t).done(function(t) {
                setTimeout(function() {
                    cave.brw_scrollImmediately(0, 0)
                }, 0), "forward" === o ? Olive.Pjax.cachePush(n, t) : "replace" === o && Olive.Pjax.cacheReplace(n, t)
            }).fail(function() {
                "forward" === o && (Olive.router.isReverting = !0, history.back())
            });
            var s = Olive.Pjax.cachePop(o);
            return s ? (Olive.Content.replaceBody(s), $(document).trigger("olv:pagechange:ready"), setTimeout(function() {
                $(document).trigger("olv:pagechange:end"), cave.brw_scrollImmediately(0, a)
            }, 0), $.Deferred().resolve().promise()) : Olive.Pjax.load(t).done(function(e) {
                setTimeout(function() {
                    cave.brw_scrollImmediately(0, a)
                }, 0)
            }).fail(function() {
                "back" === o && (Olive.router.isReverting = !0, history.forward())
            })
        },
        uniqueId: function() {
            return (new Date).getTime()
        },
        cacheClear: function() {
            Olive.Pjax.isEnabled && (Olive.Pjax.cacheMapping_ = {})
        }
    }, Olive.History = {
        isInitialLoad: !0,
        state: void 0,
        needToSetState: void 0 === history.state
    }, Olive.Browsing = {
        navigate: function(t) {
            Olive.router.navigate(t, !0)
        },
        replaceWith: function(t) {
            Olive.router.navigate(t, {
                trigger: !0,
                replace: !0
            })
        },
        reload: function() {
            Olive.Pjax.isEnabled ? Olive.Browsing.replaceWith(location.href) : location.reload()
        },
        goBack: function() {
            cave.brw_notifyPageMoving(), Olive.Loading.lock(), history.back()
        }
    }, Olive.Toolbar = {
        setup: function() {
            var e = ["BACK", "BACK_KEY", "ACTIVITY", "COMMUNITY", "NOTIFICATION", "MYMENU", "GUIDE"],
                t = this;
            _.each(e, function(e) {
                cave.toolbar_setCallback(t.buttons[e], t[e.toLowerCase() + "Callback"])
            })
        },
        buttons: {
            EXIT: 0,
            BACK: 1,
            ACTIVITY: 2,
            COMMUNITY: 3,
            NOTIFICATION: 4,
            MYMENU: 5,
            GUIDE: 7,
            BACK_KEY: 99
        },
        backCallback: function() {
            Olive.router.lockRequest || (Olive.router.lockRequest = !0, history.back())
        },
        back_keyCallback: function() {
            Olive.Toolbar.backCallback()
        },
        activityCallback: function() {
            Olive.Toolbar.activateButton(Olive.Toolbar.buttons.ACTIVITY), Olive.Browsing.navigate("/")
        },
        communityCallback: function() {
            Olive.Toolbar.activateButton(Olive.Toolbar.buttons.COMMUNITY), Olive.Browsing.navigate("/communities")
        },
        notificationCallback: function() {
            Olive.Toolbar.activateButton(Olive.Toolbar.buttons.NOTIFICATION), Olive.Browsing.navigate("/news/my_news")
        },
        mymenuCallback: function() {
            Olive.Toolbar.activateButton(Olive.Toolbar.buttons.MYMENU);
            var t = $("body").attr("data-profile-url");
            Olive.Browsing.navigate(t)
        },
        guideCallback: function() {
            Olive.Toolbar.activateButton(Olive.Toolbar.buttons.GUIDE), Olive.Browsing.navigate("/guide/for_guest")
        },
        setCornerButtonType: function(e) {
            e != this.buttons.EXIT && e != this.buttons.BACK || cave.toolbar_setButtonType(e)
        },
        _activeButtonId: void 0,
        activateButton: function(e) {
            this._activeButtonId = e, cave.toolbar_setActiveButton(e)
        },
        _currentVisibility: void 0,
        setVisible: function(e) {
            this._currentVisibility = !!e, cave.toolbar_setVisible(e), e && this._activeButtonId && cave.toolbar_setActiveButton(this._activeButtonId)
        },
        isVisible: function() {
            return this._currentVisibility
        },
        setNotificationCount: function(e) {
            cave.toolbar_setNotificationCount(e)
        }
    }, Olive.ImageViewer = {
        setup: function() {
            cave.viewer_setOnCloseCallback(this.close_viewerCallback)
        },
        close_viewerCallback: function() {
            Olive.router.lockRequest = !1
        }
    }, document.addEventListener("DOMContentLoaded", function() {
        Olive.Toolbar.setup()
    }), Olive.View = Olive.View || {}, Olive.View.Page = Olive.View.Page || {}, Olive.View.Page.current = void 0, Olive.View.Page.Common = Backbone.View.extend({
        widgets: [],
        isCurrent: function() {
            return Olive.View.Page.current && Olive.View.Page.current.cid === this.cid
        },
        initialize: function() {
            this.widgets = [], Olive.View.Page.current && !this.isCurrent() && Olive.View.Page.current.undelegateEvents(), Olive.View.Page.current = this, Olive.Guest.isGuest() ? this.widgets.push(new Olive.View.Widget.GuestDialog({
                el: $("#body")
            })) : this.widgets.push(new Olive.View.Widget.UpdateChecker({
                el: $(document)
            })), this.widgets.push(new Olive.View.Widget.ExitOrBackButton({
                el: $(document)
            })), this.widgets.push(new Olive.View.Widget.ToolbarVisibility({
                el: $(document)
            })), this.widgets.push(new Olive.View.Widget.PostScroller({
                el: $(document)
            })), this.widgets.push(new Olive.View.Widget.HomeButton({
                el: $(document)
            }))
        },
        delegateEvents: function() {
            Backbone.View.prototype.delegateEvents.call(this), _.each(this.widgets, function(e) {
                e.delegateEvents()
            })
        },
        undelegateEvents: function() {
            _.each(this.widgets, function(e) {
                e.undelegateEvents()
            }), Backbone.View.prototype.undelegateEvents.call(this)
        }
    }), Olive.View.Page.Activity = Olive.View.Page.Common.extend({
        isAbortByPageChange: !1,
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this);
            var t = this.loadActivity(),
                i = this.loadFollowingsProfilePosts(),
                o = this;
            $(document).one("olv:pagechange:start", function() {
                o.isAbortByPageChange = !0, t.abort && t.abort()
            }), $.when(t, i).done(function(e, t) {
                var i = $($.trim(t[0])),
                    n = [];
                o.$("[data-latest-following-relation-profile-post-placeholder]").each(function(e, t) {
                    var o = i.get(e);
                    o && ($(t).html(o), n.push(t))
                }), $(n).removeClass("none")
            }).done(function() {
                o.widgets.push(new Olive.View.Widget.Follow({
                    el: o.$(".toggle-follow-button")
                }))
            })
        },
        loadActivity: function() {
            var t = this,
                i = $(".content-loading-window");
            return (i.length ? Olive.Net.ajax({
                type: "GET",
                url: location.pathname + location.search,
                silent: !0
            }).done(function(t) {
                Olive.Content.replaceBody(t)
            }).fail(function(e, o, n, a) {
                i.remove(), t.isAbortByPageChange || $(".content-load-error-window").removeClass("none")
            }) : $.Deferred().resolve().promise()).then(function() {
                t.delayedInitialize()
            })
        },
        loadFollowingsProfilePosts: function() {
            return Olive.Net.ajax({
                type: "GET",
                url: "/my/latest_following_related_profile_posts",
                silent: !0
            })
        },
        delayedInitialize: function() {
            this.widgets.push(new Olive.View.Widget.Empathy({
                el: this.$(".post")
            })), this.widgets.push(new Olive.View.Widget.ImageViewer({
                el: $(".js-open-image-viewer")
            })), this.widgets.push(new Olive.View.Widget.HiddenContent({
                el: this.$(".post")
            })), this.widgets.push(new Olive.View.Widget.CloseTutorial({
                el: this.$(".tutorial-close-button")
            })), this.widgets.push(new Olive.View.Widget.PageReloader({
                el: $(document)
            })), this.widgets.push(new Olive.View.Widget.Follow({
                el: $(".toggle-follow-button")
            })), this.widgets.push(new Olive.View.Widget.UserSearch({
                el: $(".user-search-button")
            }))
        }
    }), Olive.View.Page.PostForm = Olive.View.Page.Common.extend({
        events: {
            'click input[type="checkbox"]': "onCheckboxClick",
            "click .forbidden-image-selector": "onForbiddenImageSelectorClick",
            "click .cancel-button": function() {
                cave.memo_clear(), Olive.Browsing.goBack()
            },
            "input .textarea-text": "onInput",
            "input .js-topic-title-input": "onInput",
            "olv:painting:end": "onInput",
            'click input[name="screenshot_type"]': "onScreenshotSelect",
            "olv:textarea:menu:change": "onInput",
            "submit form": "onSubmit",
            "olv:dropdown:open": "onDropdownOpen",
            "olv:dropdown:close": "onDropdownClose",
            "click .select-from-album-button": "onClickSelectFromAlbum",
            "change select[data-required]": "onInput"
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.restoreStateFromAlbumImageSelector(), this.widgets.push(new Olive.View.Widget.TextareaWithMenu({
                el: $(".textarea-with-menu").first()
            })), this.widgets.push(new Olive.View.Widget.OverlaidPreview({
                el: $(".textarea-text").first()
            }));
            var t = $(".js-topic-title-input");
            t.length && this.widgets.push(new Olive.View.Widget.OverlaidPreview({
                el: t.first()
            })), this.widgets.push(new Olive.View.Widget.CheckableControls({
                el: $(".feeling-selector").first()
            })), this.widgets.push(new Olive.View.Widget.CheckableControls({
                el: $(".spoiler-button").first()
            }));
            var i = $("#tab-header-topic-categories");
            if (i.length) {
                var o = new Olive.View.Widget.SelectButtons({
                    el: i
                });
                o.updateLabel(i.find("select")), this.widgets.push(o)
            }
            this.topicTitle = this.$(".js-topic-title-input"), this.body = this.$('form input[name="body"],textarea[name="body"]'), this.painting = this.$('form input[name="painting"]'), this.paintingPreview = this.$(".textarea-memo-preview"), this.typeBody = this.$('form input[name="_post_type"][value="body"]'), this.submit = this.$(".fixed-bottom-button-post"), this.overlaidElements = $(), this.setupScreenshotSelector(), this.toggleSubmit()
        },
        setupScreenshotSelector: function() {
            var t = this.$(".image-selector").first(),
                i = t.find(".preview-image"),
                o = t.length && !t.hasClass("disabled"),
                n = Olive.Screenshot.isEnabledAnySide(),
                a = t.find(".select-from-album-button").length;
            if (o && (n || a)) {
                this.widgets.push(new Olive.View.Widget.Dropdown({
                    el: t
                })), this.widgets.push(new Olive.View.Widget.CheckableControls({
                    el: t.find(".dropdown-menu").first()
                }));
                var s = t.find(".upside");
                s.css("display", "none");
                var r = t.find(".downside");
                r.css("display", "none"), Olive.Screenshot.isEnabled(Olive.Screenshot.SCREEN_UPSIDE) && (t.find(".upside .capture-image").attr("src", Olive.Screenshot.retrieveImagePath(Olive.Screenshot.SCREEN_UPSIDE)), s.css("display", "")), Olive.Screenshot.isEnabled(Olive.Screenshot.SCREEN_DOWNSIDE) && (t.find(".downside .capture-image").attr("src", Olive.Screenshot.retrieveImagePath(Olive.Screenshot.SCREEN_DOWNSIDE)), r.css("display", "")), i.attr("data-default-src", i.attr("src")), this.screenshotSelect(t.find('input[name="screenshot_type"]:checked'))
            } else t.length && (t.addClass("disabled"), t.find(".dropdown-toggle").addClass("forbidden-image-selector"), i.attr("src", i.attr("data-forbidden-src")))
        },
        onClickSelectFromAlbum: function(t) {
            var i = Olive.Form.serializeUserInputs(this),
                o = {
                    "album-preview-src": this.$("input.js-screenshot-radio-album").attr("data-src")
                };
            Olive.View.Page.PostForm.postArgsStock.push({
                formControls: i,
                miscAttributes: o
            })
        },
        onCheckboxClick: function(e) {
            var t = e.target;
            $(t).attr("data-sound", t.checked ? "SE_OLV_CHECKBOX_CHECK" : "SE_OLV_CHECKBOX_UNCHECK")
        },
        onForbiddenImageSelectorClick: function(t) {
            t.preventDefault(), Olive.deferredAlert(null, Olive.loc("olv.portal.post.screenshot_forbidden.for_n3ds"))
        },
        onInput: function(e) {
            this.toggleSubmit()
        },
        appearedGraphicalChars: function() {
            var e = this.topicTitle.length ? this.topicTitle : this.body;
            return !this.nonGraphicalCharsPattern.test(e.val())
        },
        nonGraphicalCharsPattern: /^\s*$/,
        toggleSubmit: function(e) {
            var t = !this.typeBody.length || this.typeBody.prop("checked") ? !this.appearedGraphicalChars() || this.hasUnfilledDropdown() : "none" === this.paintingPreview.css("background-image");
            this.submit.prop("disabled", t)
        },
        hasUnfilledDropdown: function() {
            return this.$("select[data-required]").filter(function() {
                return !$(this).val()
            }).length > 0
        },
        onSubmit: function(t) {
            Olive.Loading.lock();
            var i = $(t.currentTarget).find('input[type="submit"]');
            Olive.Form.toggleDisabled(i, !0), this.painting && this.painting.prop("disabled") && this.painting.val("")
        },
        onScreenshotSelect: function(e) {
            var t = $(e.currentTarget);
            this.screenshotSelect(t)
        },
        screenshotSelect: function(e) {
            var t = this.$(".dropdown-toggle .preview-image"),
                i = function(e) {
                    t.attr("src", e)
                },
                o = $.proxy(function(e) {
                    $('input[name="album_image_id"]').val("");
                    var o = "";
                    if (null !== e) {
                        var n = this.$('[name="screenshot"]');
                        n.prop("disabled", !1).attr("lls", e), n.focus(), n.trigger("click"), o = cave.lls_getPath(e)
                    } else this.$('[name="screenshot"]').prop("disabled", !0), o = t.attr("data-default-src");
                    i(o)
                }, this);
            switch (e.val()) {
                case "js-album":
                    i(e.attr("data-src"));
                    break;
                case "upside":
                    o("upside");
                    break;
                case "downside":
                    o("downside");
                    break;
                case "null":
                    o(null)
            }
        },
        onDropdownOpen: function(t, i) {
            this.overlaidElements = this.$("#bottom-menu input:enabled"), Olive.Form.toggleDisabled(this.overlaidElements, !0)
        },
        onDropdownClose: function(t, i) {
            Olive.Form.toggleDisabled(this.overlaidElements, !1), this.overlaidElements = $()
        },
        restoreStateFromAlbumImageSelector: function() {
            var t = Olive.View.Page.PostForm.postArgsStock.shift();
            if (t) {
                var i = t.formControls;
                Olive.Form.fillInputsWithSerializedObject(this, i);
                var o = t.miscAttributes;
                $("input.js-screenshot-radio-album").attr("data-src", o["album-preview-src"])
            }
            var n = Olive.View.Page.PostFormAlbumSelector.stock.shift();
            n && ($('input[name="album_image_id"]').val(n.albumImageId), $("input.js-screenshot-radio-album").attr("data-src", n.previewUrl).prop("checked", !0))
        }
    }), Olive.View.Page.PostForm.postArgsStock = [], Olive.View.Page.PostFormError = Olive.View.Page.Common.extend({
        events: {
            "click .back-button": function() {
                Olive.Browsing.goBack()
            }
        }
    }), Olive.View.Page.ReplyForm = Olive.View.Page.PostForm.extend({}), Olive.View.Page.PostMemo = Olive.View.Page.Common.extend({
        events: {
            "click .delete-button": "onDeleteButton",
            "submit form": "onSubmit"
        },
        onSubmit: function(t) {
            Olive.Loading.lock();
            var i = $(t.currentTarget).find('input[type="submit"]');
            Olive.Form.toggleDisabled(i, !0)
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), Olive.PostStorage.sweep();
            var t = Olive.PostStorage.getAll(),
                i = t[0];
            if (t[1] > 0) {
                this.$(".no-content-window").addClass("none").siblings().removeClass("none");
                var o = 0,
                    n = this;
                _.each(_.keys(i).sort(function(e, t) {
                    return t - e
                }), function(e) {
                    n.viewPost(i[e], e, o), o += 1
                });
                for (var a = o; a < Olive.PostStorage.maxLocalStorageNum; a++) this.clearContent(this.$("#post-" + a));
                $('input[name="screenshot"], input[name="thumbnail"]').forEach(function(e) {
                    e.focus(), $(e).trigger("click"), $(e).css("display", "none"), e.blur()
                })
            } else this.$(".no-content-window").removeClass("none").siblings().addClass("none")
        },
        viewPost: function(t, i, o) {
            function n(e) {
                if (2 === (e += "").length) {
                    var t = e.match(/^([0-9])([0-9])$/);
                    if (t[0] && "0" === t[1]) return t[2]
                }
                return e
            }
            var a = JSON.parse(t),
                s = this.$("#post-" + o);
            s.find(".user-name").text(cave.mii_getName());
            var r = cave.convertTimeToString(Number(i)).match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})\s([0-9]{2}):([0-9]{2}):([0-9]{2})/),
                l = Olive.loc("olv.datetime"),
                c = r[1],
                u = r[2],
                d = r[3],
                p = r[4],
                g = +p,
                h = r[5];
            1 === l.match(/M/g).length && (u = n(u)), 1 === l.match(/d/g).length && (d = n(d)), 1 === l.match(/m/g).length && (d = n(h));
            var m = "";
            /a/.test(l) ? (g < 12 ? m = " AM" : (m = " PM", g -= 12), p = 1 === l.match(/h/g).length ? n(g) : function(e) {
                return 1 === (e += "").length ? "0" + e : e
            }(g)) : 1 === l.match(/H/g).length && (p = n(p)), s.find(".timestamp-container .timestamp").text(Olive.loc("olv.datetime.n3ds.date", c, u, d) + " " + p + ":" + h + m), s.find(".user-icon").attr("src", cave.mii_getIconBase64(Number(a.feeling))), a.titleID && s.find('input[name="memo_title_id"]').val(a.titleID);
            var f = s.find(".screenshot-container");
            f.toggleClass("none", !a.screenShotKey);
            var v = s.find('input[name="screenshot"]');
            if (a.screenShotKey) {
                b = cave.lls_getPath(a.screenShotKey);
                f.find("img").attr("src", b), f.find("a").attr("href", b), v.prop("disabled", !1).attr("lls", a.screenShotKey)
            } else v.prop("disabled", !0);
            var w = s.find('input[name="thumbnail"]');
            if (a.thumbnailKey) {
                var b = cave.lls_getPath(a.thumbnailKey);
                f.find("img").attr("src", b), w.prop("disabled", !1).attr("lls", a.thumbnailKey)
            } else w.prop("disabled", !0);
            s.find(".spoiler").toggleClass("none", !a.spoiler), s.find('input[name="is_spoiler"]').val(a.spoiler ? "1" : ""), s.find('input[name="feeling_id"]').val(a.feeling), void 0 !== a.appStartable && (a.appStartable && s.find('input[name="is_app_jumpable"]').val("1").prop("disabled", !1), void 0 !== a.externalUrl && null !== a.externalUrl && s.find('input[name="url"]').val(a.externalUrl).prop("disabled", !1), void 0 !== a.appData && null !== a.appData && s.find('input[name="app_data"]').val(a.appData).prop("disabled", !1), void 0 !== a.topicTag && null !== a.topicTag && (s.find('input[name="topic_tag"]').val(a.topicTag).prop("disabled", !1), s.find(".post-tag").text(a.topicTag).removeClass("none")), void 0 !== a.searchKeys && a.searchKeys instanceof Array && _.each(a.searchKeys, function(e) {
                s.find('input[name="topic_tag"]').after($("<input>", {
                    type: "hidden",
                    name: "search_key",
                    value: e
                }))
            }), s.find('input[name="has_title_depended_value"]').val("1").prop("disabled", !1));
            $("#list-content").attr("data-available-post-type");
            var y, k = s.find(".post-content"),
                C = k.find(".post-content-text"),
                V = k.find(".post-content-memo");
            if (void 0 !== a.text && null !== a.text) C.text(a.text), C.removeClass("none"), V.addClass("none"), s.find('input[name="body"]').val(a.text), y = "body";
            else {
                var P = "data:image/bmp;base64," + a.paint;
                V.find("img").attr("src", P), V.removeClass("none"), C.addClass("none"), s.find('input[name="painting"]').val(a.paint), y = "painting"
            }
            s.toggleClass("forbidden", !0), s.find(".post-button").prop("disabled", !0);
            var S = {};
            S.post_type = y, a.titleID && (S.src_title_id = a.titleID), a.screenShotKey && (S.has_screenshot = "1"), void 0 !== a.communityId && null !== a.communityId && (S.dst_nex_community_id = a.communityId);
            Olive.Net.get("post_memo.check.json", S).done(function(e) {
                if (e.show_community_name) {
                    var t = s.find(".community-container");
                    t.removeClass("none"), e.community_path ? t.find("a").attr("href", e.community_path) : t.find("a").removeAttr("href"), t.find("img").attr("src", e.community_icon_url), t.find(".community-container-inner").append(e.community_name)
                }
                "1" == e.can_post ? (s.find('input[name="olive_community_id"]').val(e.olive_community_id), s.find('input[name="olive_title_id"]').val(e.olive_title_id), s.toggleClass("forbidden", !1), s.find(".post-button").prop("disabled", !1)) : (s.find(".forbidden-message").toggleClass("none", !1), s.find(".forbidden-message").text(e.message))
            }).fail(function(e, t, i, o) {});
            s.attr("data-ls-key", i), s.find('input[name="ls_key"]').val(i), s.removeClass("none")
        },
        clearContent: function(e) {
            e.addClass("none")
        },
        onDeleteButton: function(t) {
            Olive.deferredConfirm(null, Olive.loc("olv.portal.offline.post.delete")).done($.proxy(function(i) {
                if (i) {
                    var o = $(t.target).closest(".post"),
                        n = o.attr("data-ls-key");
                    Olive.PostStorage.removeItem(n), this.clearContent(o), 0 === Olive.PostStorage.getCount() && this.$(".no-content-window").removeClass("none")
                }
            }, this))
        }
    }), Olive.View.Page.PostDiaryForm = Olive.View.Page.PostForm.extend({
        setupScreenshotSelector: function() {
            var t = this.$('[name="screenshot"]');
            if (t) {
                var i = t.attr("lls");
                i ? this.setupPreSpecifiedScreenshotSelector(i) : Olive.View.Page.PostForm.prototype.setupScreenshotSelector.call(this)
            }
        },
        setupPreSpecifiedScreenshotSelector: function(e) {
            this.$(".image-selector").first().find(".preview-image"), this.$('[name="screenshot"]').attr("lls");
            var t = $.proxy(function(e) {
                var t = this.$(".image-selector .preview-image"),
                    i = this.$('input[name="screenshot"]'),
                    o = "";
                null !== e ? (i.prop("disabled", !1), i.focus(), i.trigger("click"), o = cave.lls_getPath(e)) : (i.prop("disabled", !0), o = t.attr("data-forbidden-src")), t.attr("src", o)
            }, this);
            switch (e) {
                case "upside":
                    t("upside");
                    break;
                case "downside":
                    t("downside");
                    break;
                default:
                    t(null)
            }
        },
        onSubmit: function(t) {
            if ($(t.currentTarget).find('input[name="album_image_id"]').val());
            else {
                var i = $($(t.currentTarget).find('input[name="screenshot"]')),
                    o = this.$(".image-selector").first(),
                    n = o.length && !o.hasClass("disabled"),
                    a = !i.attr("disabled");
                if (Olive.Screenshot.isEnabledAnySide() && n && !a) return Olive.deferredAlert(null, Olive.loc("olv.portal.post.screenshot_required")), !1
            }
            return Olive.View.Page.PostForm.prototype.onSubmit.call(this, t), !0
        }
    }), Olive.View.Page.PostRedirection = Olive.View.Page.Common.extend({
        initialize: function() {
            var t = $("#fresh-post-fragment");
            if (t.length) {
                var i = t.attr("data-ls-key");
                i ? Olive.PostStorage.removeItem(i) : cave.memo_clear();
                var o = cave.history_getPrev();
                /\/(?:post|post\.memo|reply)(?:$|[?#])/.test(o) && (cave.history_removePrev(), o = cave.history_getPrev());
                var n = t.attr("data-back-url");
                location.protocol + "//" + location.host + n === o && cave.history_removePrev(), Olive.View.Widget.FreshPost.stock.push(t), setTimeout(function() {
                    Olive.Browsing.replaceWith(n)
                }, 0)
            }
        }
    }), Olive.View.Page.Community = Olive.View.Page.Common.extend({
        events: {
            "click .unfavorite-button": "onUnfavorite",
            "click .js-topic-post-button": "clickTopicPost"
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.FavoriteButtons({
                el: $("#header-meta").find(".favorite-button")
            })), this.widgets.push(new Olive.View.Widget.FreshPost({
                el: $(".post-list")
            })), Olive.Guest.isGuest() || this.widgets.push(new Olive.View.Widget.InfoTicker({
                el: $(".info-ticker")
            })), this.widgets.push(new Olive.View.Widget.Empathy({
                el: $(".post")
            })), this.widgets.push(new Olive.View.Widget.ImageViewer({
                el: $(".js-open-image-viewer")
            })), this.widgets.push(new Olive.View.Widget.HiddenContent({
                el: $(".post")
            })), this.widgets.push(new Olive.View.Widget.HiddenContent({
                el: $(".multi-timeline-post")
            })), this.widgets.push(new Olive.View.Widget.URLSelector({
                el: $("#post-filter")
            })), this.widgets.push(new Olive.View.Widget.eShopJump({
                el: $(".eshop-button")
            })), this.widgets.push(new Olive.View.Widget.PageReloader({
                el: $(document)
            })), this.widgets.push(new Olive.View.Widget.FirstPostNotice({
                el: $(".js-post-button")
            })), this.widgets.push(new Olive.View.Widget.URLSelector({
                el: $(".js-select-button")
            })), $(".age-gate-dialog").length && (this.widgets.push(new Olive.View.Widget.AgeGateDialog({
                el: this.$(".age-gate-dialog")
            })), this.widgets.push(new Olive.View.Widget.SelectButtons({
                el: this.$(".age-gate-dialog .window-body-inner")
            }))), $(".toggle-follow-button").length && this.widgets.push(new Olive.View.Widget.Follow({
                el: $(".toggle-follow-button")
            }))
        },
        onUnfavorite: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget);
            Olive.Form.isDisabled(i) || Olive.Form.post(i.attr("data-action"), null, i).done(function() {
                Olive.deferredAlert(null, Olive.loc("olv.portal.unfavorite_succeeded_to")), i.add(i.prev()).remove(), $(".unfavorite-confirm-message").remove()
            })
        },
        clickTopicPost: function(e) {
            e.preventDefault(), $(".js-topic-filter").addClass("open")
        }
    }), Olive.View.Page.Post = Olive.View.Page.Common.extend({
        events: {
            "click .link-button": "onPostLinkClick",
            "click .app-jump-button": "onAppJumpClick"
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.FreshReply({
                el: this.$(".post-permalink-reply")
            })), this.widgets.push(new Olive.View.Widget.EmpathyWithIcons({
                el: $(".post")
            })), this.widgets.push(new Olive.View.Widget.Empathy({
                el: $("#post-permalink-comments")
            })), this.widgets.push(new Olive.View.Widget.ImageViewer({
                el: $(".js-open-image-viewer")
            })), this.widgets.push(new Olive.View.Widget.Reply({
                el: this.$("#post-permalink-comments")
            })), this.widgets.push(new Olive.View.Widget.HiddenContent({
                el: this.$("#post-permalink-comments")
            })), this.widgets.push(new Olive.View.Widget.YoutubeJump({
                el: this.$(".video")
            })), this.widgets.push(new Olive.View.Widget.FirstPostNotice({
                el: $(".reply-button")
            })), this.widgets.push(new Olive.View.Widget.PageReloader({
                el: $(document)
            })), $("#body-language-selector").length && (this.widgets.push(new Olive.View.Widget.BodyLanguageSelector({
                el: $("#body-language-selector")
            })), this.widgets.push(new Olive.View.Widget.SelectButtons({
                el: $(".select-button")
            }))), $(".post.official-user.post-subtype-default").length && this.widgets.push(new Olive.View.Widget.MoreContentButton({
                el: $(".post.official-user.post-subtype-default")
            })), this.widgets.push(new Olive.View.Widget.CloseTopicPost({
                el: this.$(".post-meta")
            }))
        },
        onPostLinkClick: function(t) {
            var i = $(t.currentTarget);
            if (!Olive.Form.isDisabled(i) && !t.isDefaultPrevented()) {
                t.preventDefault();
                var o = i.attr("href");
                cave.jump_existsWebbrs && !cave.jump_existsWebbrs() ? Olive.deferredConfirm(Olive.loc("olv.portal.confirm_syste_update.title"), Olive.loc("olv.portal.confirm_syste_update.body")).done(function(e) {
                    e && cave.jump_toSystemUpdate(1)
                }) : Olive.deferredConfirm(Olive.loc("olv.portal.confirm_url_form.title"), Olive.loc("olv.portal.confirm_url_form.body.for_n3ds") + "\n" + o).done(function(e) {
                    e && cave.jump_toWebbrs(o)
                })
            }
        },
        onAppJumpClick: function(t) {
            var i = $(t.currentTarget);
            if (!Olive.Form.isDisabled(i) && !t.isDefaultPrevented()) {
                t.preventDefault();
                var o = i.attr("data-app-jump-title-ids").split(","),
                    n = i.attr("data-title-id");
                n && o.unshift(n);
                for (var a, s = 0; s < o.length; s++)
                    if (cave.jump_existsApplication(o[s])) {
                        a = o[s];
                        break
                    }
                a ? Olive.deferredConfirm(null, Olive.loc("olv.portal.confirm_app_jump")).done(function(e) {
                    if (e) {
                        if (cave.jump_resetParamToApp(), cave.jump_canUseQuery(a)) {
                            cave.jump_setModeToApp(2), cave.jump_setDataUTF8ToApp(13, i.attr("data-url-id")), cave.jump_setNumberDataToApp(12, Number(i.attr("data-nex-community-id")));
                            var t = i.attr("data-app-data");
                            t && cave.jump_setBase64DataToApp(5, t)
                        }
                        cave.jump_toApplication(1, a)
                    }
                }) : Olive.deferredAlert(null, Olive.loc("olv.portal.confirm_you_have_no_soft"))
            }
        },
        mayIncrementMoreRepliesButtonCount: function(e) {}
    }), Olive.View.Page.Reply = Olive.View.Page.Post.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.EmpathyWithIcons({
                el: $(".reply-permalink-content")
            })), this.widgets.push(new Olive.View.Widget.ImageViewer({
                el: $(".js-open-image-viewer")
            })), this.widgets.push(new Olive.View.Widget.HiddenContent({
                el: this.$("#post-permalink-comments")
            })), this.widgets.push(new Olive.View.Widget.PageReloader({
                el: $(document)
            })), $("#body-language-selector").length && (this.widgets.push(new Olive.View.Widget.BodyLanguageSelector({
                el: $("#body-language-selector")
            })), this.widgets.push(new Olive.View.Widget.SelectButtons({
                el: $(".select-button")
            })))
        }
    }), Olive.View.Page.Violation = Olive.View.Page.Common.extend({
        events: {
            "change select": "onChangeViolationType",
            'input textarea[name="body"]': "onInputBody",
            "click .cancel-button": function() {
                Olive.Browsing.goBack()
            }
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.PostToBack({
                el: $("form")
            })), this.$selectContent = this.$("span.select-button-content"), this.$type = this.$('select[name="type"]'), this.$body = this.$('textarea[name="body"]'), this.$submit = this.$(".post-button")
        },
        onChangeViolationType: function() {
            var e = $(this.$type[0].options[this.$type[0].selectedIndex]),
                t = !!this.$type.val();
            this.$selectContent.text(e.text()), this.$body.toggleClass("none", !t), this.updateSubmitBody()
        },
        onInputBody: function() {
            this.updateSubmitBody()
        },
        updateSubmitBody: function() {
            var e = $(this.$type[0].options[this.$type[0].selectedIndex]),
                t = !!e.val(),
                i = !!e.attr("data-body-required"),
                o = !t || i && /^\s*$/.test(this.$body.val());
            this.$submit.prop("disabled", o)
        }
    }), Olive.View.Page.EditForm = Olive.View.Page.Common.extend({
        events: {
            "change select": "onSelectChange",
            "click .cancel-button": function() {
                Olive.Browsing.goBack()
            },
            submit: "onSubmit"
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.SelectButtons({
                el: this.$(".select-button")
            }))
        },
        onSelectChange: function(e) {
            var t = !!$(e.currentTarget).val();
            this.$(".post-button").prop("disabled", !t)
        },
        onSubmit: function(t) {
            t.preventDefault();
            var i = $("#edit_type").val(),
                o = /^(screenshot|painting)-profile-post$/.test(i);
            if (!o || Olive.confirm(Olive.loc("olv.portal.profile_post"), Olive.loc("olv.portal.profile_post.confirm_update"), Olive.loc("olv.portal.cancel"), Olive.loc("olv.portal.profile_post.confirm_update.yes"))) {
                var n = $("form"),
                    a = n.find('input[type="submit"]');
                Olive.Form.submit(n, a, !0).done(function() {
                    o && Olive.confirm(Olive.loc("olv.portal.profile_post"), Olive.loc("olv.portal.profile_post.done"), Olive.loc("olv.portal.close"), Olive.loc("olv.portal.user.search.go")) ? Olive.Browsing.replaceWith("/users/@me") : history.back()
                })
            }
        }
    }), Olive.View.Page.Blacklist = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.Blacklist({
                el: $("#block-list-page")
            }))
        }
    }), Olive.View.Page.ConfirmBlacklist = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.ConfirmBlacklist({
                el: $(".window-bottom-buttons")
            }))
        }
    }), Olive.View.Page.IdentifiedUserPosts = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.Follow({
                el: $(".toggle-follow-button")
            })), this.widgets.push(new Olive.View.Widget.ImageViewer({
                el: $(".js-open-image-viewer")
            }))
        }
    }), Olive.View.Page.User = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.URLSelector({
                el: $("#user-violator-blacklist")
            })), this.widgets.push(new Olive.View.Widget.Follow({
                el: $(".toggle-follow-button")
            })), this.widgets.push(new Olive.View.Widget.Empathy({
                el: $(".post")
            })), this.widgets.push(new Olive.View.Widget.ImageViewer({
                el: $(".js-open-image-viewer")
            })), this.widgets.push(new Olive.View.Widget.HiddenContent({
                el: $(".post, .multi-timeline-post")
            }))
        }
    }), Olive.View.Page.UserDiary = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.URLSelector({
                el: $("#user-violator-blacklist")
            })), this.widgets.push(new Olive.View.Widget.Empathy({
                el: $(".post")
            })), this.widgets.push(new Olive.View.Widget.ImageViewer({
                el: $(".js-open-image-viewer")
            })), this.widgets.push(new Olive.View.Widget.HiddenContent({
                el: $(".post")
            })), this.widgets.push(new Olive.View.Widget.CheckableControls({
                el: $(".js-diary-screenshot-window")
            })), this.widgets.push(new Olive.View.Widget.CreateDiaryOrSaveScreenshotWindow({
                el: $(".js-diary-screenshot-window")
            })), this.widgets.push(new Olive.View.Widget.FreshPost({
                el: this.$(".post-list")
            }))
        }
    }), Olive.View.Page.Settings = Olive.View.Page.Common.extend({
        events: {
            "submit .setting-form": "onSubmit",
            "click #profile-post": "onProfilePostRemoveClick"
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.SelectButtons({
                el: this.$(".settings-list")
            })), Olive.ScrollGuide.activate()
        },
        onProfilePostRemoveClick: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget);
            Olive.deferredConfirm(Olive.loc("olv.portal.profile_post"), Olive.loc("olv.portal.profile_post.confirm_remove"), Olive.loc("olv.portal.stop"), Olive.loc("olv.portal.button.remove")).done(function(t) {
                t && Olive.Form.post("/settings/profile_post.unset.json", null, i, !0).done(function() {
                    i.remove()
                })
            })
        },
        onSubmit: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget),
                o = i.find('input[type="submit"]');
            Olive.Form.submit(i, o, !0).done(function() {
                Olive.alert(null, Olive.loc("olv.portal.dialog.apply_settings_done"))
            })
        }
    }), Olive.View.Page.AccountSettings = Olive.View.Page.Settings.extend({
        events: {
            "submit .setting-form": "onSubmit"
        },
        initialize: function() {
            Olive.View.Page.Settings.prototype.initialize.call(this)
        },
        onSubmit: function(t) {
            t.preventDefault(), cave.boss_unregist(), Olive.View.Page.Settings.prototype.onSubmit.call(this, t)
        }
    }), Olive.View.Page.ProfileSettings = Olive.View.Page.Settings.extend({
        initialize: function() {
            Olive.View.Page.Settings.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.MultipleSelectMediator({
                el: this.$("#favorite-game-genre")
            }))
        },
        onSubmit: function(t) {
            Olive.View.Page.Settings.prototype.onSubmit.call(this, t)
        }
    }), Olive.View.Page.Welcome = Olive.View.Page.Common.extend({
        events: {
            "click .slide-button": "onSlideClick",
            "click .welcome-exit-button": "onExitClick",
            "click .welcome-luminous_user_data-button": "onLuminousUserDataClick",
            "click .welcome-finish-button": "onFinishClick",
            "olv:welcome:slide .slide-page": "onSlide"
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(), this.slideByButton($("<button/>").attr("data-slide", ".start-page")), this.showScrollGuideTimer = null
        },
        slideByButton: function(t) {
            document.activeElement.blur();
            var i = t.closest(".slide-page"),
                o = $(t.attr("data-slide"));
            cave.brw_notifyPageMoving(), i.attr("data-scroll", t.attr("data-save-scroll") ? cave.brw_getScrollTopY() : null), i.hide(), o.show(), cave.brw_scrollImmediately(0, +o.attr("data-scroll") || 0);
            var n = o.attr("data-bgm");
            n && Olive.Sound.playBGM(n), o.trigger("olv:welcome:slide")
        },
        onSlide: function(t) {
            var i = $(t.currentTarget).attr("id");
            if (clearTimeout(this.showScrollGuideTimer), "welcome-guideline" === i || "welcome-guideline-body" === i) this.showScrollGuideTimer = setTimeout(function() {
                cave.brw_getScrollTopY() <= 0 && Olive.ScrollGuide.show()
            }, 1500);
            else if ("welcome-finish" === i) {
                var o = this.$(".welcome-finish-button"),
                    n = o.attr("data-activate-url");
                Olive.Form.post(n, $("#user_data").serialize(), o, !0).done(function(done) {
                    Olive.OneTime.updatePlayedTitles()
                }).fail(function() {
                    Olive.Browsing.reload()
                })
            }
        },
        onSlideClick: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget);
            Olive.Form.isDisabled(i) || this.slideByButton(i)
        },
        onExitClick: function(e) {
            e.preventDefault(), setTimeout(function() {
                cave.exitApp()
            }, 0)
        },
        onLuminousUserDataClick: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget);
            cave.boss_unregist();
            if ($('input[name="welcome_username"]').val().length > 0 && $('input[name="welcome_nnid"]').val().length > 0) {
                var o = this.$("#user_data"),
                    n = o.attr("data-check-url")
                    self = this;
                Olive.Form.post(n, o.serialize(), o, !0).done(function(data) {
                    switch (data) {
                        case 'username':
                            Olive.deferredAlert(null, Olive.loc("olv.welcome.check.username"));
                            break;
                        case 'nnid':
                            Olive.deferredAlert(null, Olive.loc("olv.welcome.check.nnid"));
                            break;
                        case 'nonnid':
                            Olive.deferredAlert(null, Olive.loc("olv.welcome.check.nonnid"));
                            break;
                        case 'ok':
                            self.slideByButton(i);
                            break;
                        default:
                            Olive.deferredAlert(null, Olive.loc("olv.portal.error.500.for_n3ds"));
                            break;
                    }
                }).fail(function() {
                    Olive.deferredAlert(null, Olive.loc("olv.portal.error.500.for_n3ds"))
                })
            } else {
                Olive.deferredAlert(null, Olive.loc("olv.portal.welcome.user_data"))
            }
        },
        onLuminousOptInButtonClick: function(e) {
            +$(e.currentTarget).val() ? cave.boss_registEx(1, 336) : cave.boss_unregist()
        },
        onFinishClick: function(e) {
            cave.lls_setItem("agree_olv", "1")
        }
    }), Olive.View.Page.WelcomeProfile = Olive.View.Page.Common.extend({
        events: {
            "click .js-slide-button.back-button": "onBackButtonClick",
            "click .js-slide-button.next-button": "onNextButtonClick"
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.CheckableControls({
                el: this.$(".js-checkable-controls")
            })), this.widgets.push(new Olive.View.Widget.MultipleSelectMediator({
                el: this.$("#js-favorite-game-genre-form")
            })), this.widgets.push(new Olive.View.Widget.SelectButtons({
                el: this.$("#js-favorite-game-genre-form")
            })), this.widgets.push(new Olive.View.Widget.AchievementUpdater({
                el: this.$("#welcome-profile-window")
            })), this.$pageWindow = $("#welcome-profile-window");
            this.slideByButton($("<button/>").attr("data-slide", "#profile-game-skill"))
        },
        slideByButton: function(e) {
            document.activeElement.blur();
            var t = e.closest(".js-slide-page"),
                i = $(e.attr("data-slide"));
            cave.brw_notifyPageMoving(), t.length && (t.addClass("none"), this.$pageWindow.removeClass(t.attr("id"))), i.removeClass("none"), this.$pageWindow.addClass(i.attr("id"))
        },
        onBackButtonClick: function(e) {
            e.preventDefault();
            var t = $(e.currentTarget);
            this.slideByButton(t)
        },
        onNextButtonClick: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget),
                o = i.closest(".js-slide-page").find("form"),
                n = this;
            Olive.Form.submit(o, i, !0).done(function() {
                i.attr("data-slide") && n.slideByButton(i), i.hasClass("finish-button") && (i.one("olv:achievement:update:done", function() {
                    Olive.Browsing.replaceWith(i.attr("data-href"))
                }), i.trigger("olv:achievement:update"))
            })
        }
    }), Olive.View.Page.WelcomeFavoriteCommunityVisibility = Olive.View.Page.Common.extend({
        events: {
            "click .next-button": "onClickToMyPageButton"
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.CheckableControls({
                el: this.$(".js-checkable-controls")
            })), this.widgets.push(new Olive.View.Widget.AchievementUpdater({
                el: this.$("#favorite-community-suggest")
            }))
        },
        onClickToMyPageButton: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget),
                o = $("#js-favorite-community-visibility-form");
            Olive.Form.submit(o, i, !0).done(function() {
                i.one("olv:achievement:update:done", function() {
                    Olive.Browsing.replaceWith(i.attr("data-href"))
                }), i.trigger("olv:achievement:update")
            })
        }
    }), Olive.View.Page.GuestWelcome = Olive.View.Page.Common.extend({
        events: {
            "click a[href]":"onAnyLinkClick"
        },
        onAnyLinkClick: function(e) {
            var t = $(e.currentTarget);
            cave.ls_setGuestModeLaunched(!0),
            t.hasClass("register") && (e.preventDefault(), setTimeout(function () {
                cave.jump_toAccount(1)
            }, 0)),
            t.hasClass("more-button") && (e.preventDefault(), setTimeout(function () {
                cave.exitApp()
            }, 0))
        }
    }), Olive.View.Page.Users = Olive.View.Page.Common.extend({
        events: {
            "click .cancel-button": function() {
                Olive.Browsing.goBack()
            }
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.UserSearch({
                el: $(".user-search-button")
            }))
        }
    }), Olive.View.Page.TitleSearch = Olive.View.Page.Common.extend({
        events: {
            "click .cancel-button": function() {
                Olive.Browsing.goBack()
            }
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.TitleSearch({
                el: $(".title-search-button")
            }))
        }
    }), Olive.View.Page.Communities = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), Olive.Guest.isGuest() || this.widgets.push(new Olive.View.Widget.InfoTicker({
                el: $(".info-ticker")
            })), this.widgets.push(new Olive.View.Widget.URLSelector({
                el: $("#view-region-selector")
            })), this.widgets.push(new Olive.View.Widget.URLSelector({
                el: $("#view-language-selector")
            })), this.widgets.push(new Olive.View.Widget.CloseTutorial({
                el: $(".tutorial-close-button")
            })), this.widgets.push(new Olive.View.Widget.TitleSearch({
                el: $(".title-search-button")
            }))
        }
    }), Olive.View.Page.MyNews = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.CloseTutorial({
                el: $(".tutorial-close-button")
            })), this.widgets.push(new Olive.View.Widget.Follow({
                el: $(".toggle-follow-button")
            }))
        }
    }), Olive.View.Page.ConfirmAlbum = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.ConfirmAlbum({
                el: $(".js-confirm-album-window")
            }))
        }
    }), Olive.View.Page.Warning = Olive.View.Page.Common.extend({
        events: {
            'click input[type="submit"]': "onSubmit",
            "click .exit-button": "onExitButton"
        },
        onSubmit: function(t) {
            var i = $(t.currentTarget);
            if (!Olive.Form.isDisabled(i) && !t.defaultPrevented) {
                t.preventDefault();
                var o = $(t.currentTarget.form);
                Olive.Form.submit(o, i, !0, !0).done(function(t) {
                    var o = Olive.Browsing.replaceWith(t.location || "/");
                    Olive.Form.disable(i, o)
                })
            }
        },
        onExitButton: function(e) {
            e.preventDefault(), setTimeout(function() {
                cave.exitApp()
            }, 0)
        }
    }), Olive.View.Page.PostError = Olive.View.Page.Common.extend({
        events: {
            "click .back-button": function() {
                Olive.Browsing.goBack()
            }
        }
    }), Olive.View.Page.Help = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), Olive.ScrollGuide.activate()
        }
    }), Olive.View.Widget = Olive.View.Widget || {}, Olive.View.Widget.OverlaidPreview = Backbone.View.extend({
        events: {
            input: "onTextInput"
        },
        initialize: function() {
            var e;
            this.$el.attr("data-preview-class", function(t, i) {
                return e = i || "textarea-text-preview"
            }), this.textPreview = $('<div class="placeholder">').addClass(e).insertAfter(this.$el);
            var t = this.$el.val();
            this.textPreview.text(t || this.$el.attr("placeholder")), this.textPreview.toggleClass("placeholder", !t)
        },
        onTextInput: function(e) {
            var t = $(e.target),
                i = t.val();
            this.textPreview.text(i || t.attr("placeholder")), this.textPreview.toggleClass("placeholder", !i)
        }
    }), Olive.View.Widget.TextareaWithMenu = Backbone.View.extend({
        className: "textarea-with-menu",
        events: {
            'click input[name="_post_type"]': "onMenuClicked",
            "olv:painting:start": "paint",
            "click .textarea-memo-preview": function() {
                this.$el.trigger("olv:painting:start")
            }
        },
        initialize: function() {
            this.painting = this.$('form input[name="painting"]'), this.paintingPreview = this.$(".textarea-memo-preview"), this.body = this.$('input[name="body"], textarea[name="body"]'), cave.memo_hasValidImage() && this.previePaint();
            var e = this.$('input[name="_post_type"]:checked');
            this.toggleMenu(e)
        },
        onMenuClicked: function(e) {
            var t = $(e.target);
            this.toggleMenu(t), "painting" === t.val() ? this.$el.trigger("olv:painting:start") : this.inputTextBody(), this.$el.trigger("olv:textarea:menu:change")
        },
        toggleMenu: function(e) {
            var t = "body" === e.val();
            this.$el.toggleClass("active-text", t), this.$el.toggleClass("active-memo", !t), this.$('input[name="body"], textarea[name="body"]').prop("disabled", !t), this.painting.prop("disabled", t)
        },
        inputTextBody: function() {
            setTimeout($.proxy(function() {
                var e = cave.swkbd_callFullKeyboard(this.body.val(), +this.body.attr("maxlength") || 200, 0, !1, !0, !0);
                null != e && (this.body.val(e), this.body.trigger("input"))
            }, this), 0)
        },
        paint: function() {
            setTimeout($.proxy(function() {
                cave.memo_open(), cave.memo_hasValidImage() && (this.previePaint(), this.$el.trigger("olv:painting:end"))
            }, this), 0)
        },
        previePaint: function() {
            var e = cave.memo_getImageBmp(),
                t = "data:image/bmp;base64," + e;
            this.paintingPreview.css("background-image", "url(" + t + ")"), this.painting.val(e)
        }
    }), Olive.View.Widget.UpdateChecker = Backbone.View.extend({
        events: {
            "olv:updatechecker:update": "onUpdate"
        },
        onUpdate: function(t, i) {
            var o = Olive.UpdateChecker.getInstance();
            $.each(o._settings, function(e, t) {
                $.each(t.params, function(e, t) {
                    void 0 == i[e] && (this.success = !1)
                }), t.update.call(void 0, i, t.params)
            })
        },
        initialize: function() {
            var t = Olive.UpdateChecker.getInstance();
            Olive.View.Widget.UpdateChecker.isInvoked || (t.onUpdate("checkupdate", {
                news: {},
                admin_message: {},
                mission: {}
            }, function(t, i) {
                var o = 0;
                $.each(i, function(e, i) {
                    o += Number(t[e].unread_count)
                }), Olive.Toolbar.setNotificationCount(o)
            }), Olive.View.Widget.UpdateChecker.isInvoked = !0), t.invoke(), $(document).one("olv:pagechange:end", function(e, i) {
                t.pjaxLoadLog = i ? i.join(",") : ""
            }), $(document).one("olv:pagechange:start", function() {
                t.clearTimeout()
            })
        }
    }, {
        isInvoked: !1
    }), Olive.View.Widget.GuestDialog = Backbone.View.extend({
        events: {
            "click .guest-dialog": "onButtonClick"
        },
        onButtonClick: function(t) {
            t.preventDefault(), Olive.deferredConfirm(null, Olive.loc("olv.portal.guest.alert.message")).done(function(e) {
                e && cave.jump_toAccount(0)
            })
        }
    }), Olive.View.Widget.AgeGateDialog = Backbone.View.extend({
        events: {
            "click .age-confirm-button": "onAgeConfirmButton",
            "mousedown .age-gate select": "onMousedownSelect",
            "change .age-gate select": "onChangeSelect",
            "click .cancel-button": function() {
                Olive.Browsing.goBack()
            }
        },
        initialize: function() {
            $("#body").children().filter(function() {
                return !$(this).hasClass("age-gate-dialog")
            }).hide(), this.$day = this.$(".day"), this.$month = this.$(".month"), this.$year = this.$(".year")
        },
        validateDate: function(e, t, i) {
            if (isNaN(e) || isNaN(t) || isNaN(i)) return !1;
            var o = new Date(e, t - 1, i);
            return o.getFullYear() === e && o.getMonth() + 1 === t && o.getDate() === i
        },
        calculateAge: function(e, t, i) {
            var o = new Date,
                n = 100 * t + i > 100 * (o.getMonth() + 1) + o.getDate() ? 1 : 0;
            return o.getFullYear() - e - n
        },
        validateAge: function(e, t, i) {
            return this.calculateAge(e, t, i) >= 18
        },
        defaultDate: {
            year: 1990,
            month: 1,
            day: 1
        },
        selectDefault: function(e, t) {
            var i = this.defaultDate[t],
                o = $(e[0].options[e[0].selectedIndex]);
            isNaN(o.val()) && (e.find('[value="' + i + '"]').prop("selected", !0), e.trigger("change"), this.adjustDay(), o.remove())
        },
        onMousedownSelect: function(e) {
            var t = $(e.currentTarget);
            this.selectDefault(t, t.attr("name"))
        },
        adjustDay: function() {
            var e = this.$day,
                t = +e.val(),
                i = +this.$month.val(),
                o = +this.$year.val();
            if (!isNaN(i)) {
                var n = new Date(o, i, 0).getDate(),
                    a = +e.find("option").last().val();
                if (a > n) $(Array.prototype.slice.call(e[0].options, n - a)).remove();
                else if (a < n)
                    for (var s = a + 1; s <= n; s++) e.append($("<option>").val(s).text(s));
                !isNaN(t) && t > n && (e.find('[value="' + n + '"]').prop("selected", !0), e.trigger("change"))
            }
        },
        passAgeGate: function() {
            this.$el.remove(), $("#body").children().show(), Olive.Cookie.set("age_gate_done", "1")
        },
        onChangeSelect: function(e) {
            this.adjustDay()
        },
        onAgeConfirmButton: function(t) {
            var i = +this.$year.val(),
                o = +this.$month.val(),
                n = +this.$day.val();
            Olive.Cookie.get("age_gate_done") ? this.passAgeGate() : this.validateDate(i, o, n) ? this.validateAge(i, o, n) ? this.passAgeGate() : (this.$(".age-gate").addClass("none"), this.$(".back-dialog").removeClass("none")) : Olive.deferredAlert(null, Olive.Locale.text("olv.portal.age_gate.select_label"))
        }
    }), Olive.View.Widget.HiddenContent = Backbone.View.extend({
        className: "post multi-timeline-post",
        events: {
            "click .hidden-content-button": "onHiddenClick"
        },
        onHiddenClick: function(e) {
            var t = $(e.currentTarget),
                i = t.closest(".hidden");
            i.removeClass("hidden"), i.filter("[data-href-hidden]").add(i.find("[data-href-hidden]")).each(function() {
                var e = $(this);
                e.attr(e.is("a") ? "href" : "data-href", e.attr("data-href-hidden"))
            }), t.closest(".hidden-content").remove()
        }
    }), Olive.View.Widget.YoutubeJump = Backbone.View.extend({
        events: {
            click: "onClick"
        },
        onClick: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget),
                o = cave.jump_getYoutubeVersion(),
                n = i.attr("data-jump-query"); - 1 !== o ? o < 1024 ? Olive.deferredAlert(null, Olive.loc("olv.portal.n3ds.youtube.alert.patch")) : cave.jump_suspendedYoutube() ? Olive.deferredConfirm(null, Olive.loc("olv.portal.n3ds.youtube.jump")).done(function(e) {
                e && cave.jump_toSuspendedYoutube(n)
            }) : setTimeout(function() {
                cave.jump_toYoutube(1, n)
            }, 0) : Olive.deferredAlert(null, Olive.loc("olv.portal.n3ds.youtube.alert"))
        }
    }), Olive.View.Widget.Reply = Backbone.View.extend({
        events: {
            "click .more-button": "onMoreButtonClick"
        },
        onMoreButtonClick: function(t) {
            var i = $(t.currentTarget).closest("a");
            t.preventDefault(), this.loader || Olive.Form.isDisabled(i) || (Olive.Loading.lock(), this.loader = Olive.Form.get(i.attr("href"), null, i, !1).done($.proxy(function(e) {
                var t = $(e);
                if (i.hasClass("all-replies-button")) {
                    i.remove();
                    var o = t.filter(".post-permalink-reply").children().filter(function() {
                        return !$("#" + this.id).length
                    });
                    this.$el.find(".post-permalink-reply").prepend(o)
                } else this.$el.empty().append(t);
                i.hasClass("newer-replies-button") ? window.scroll(0, this.$el.offset().top) : (i.hasClass("older-replies-button") || i.hasClass("newest-replies-button")) && window.scroll(0, $(document).height())
            }, this)).always($.proxy(function() {
                i.removeClass("loading"), this.loader = null, setTimeout(function() {
                    Olive.Loading.unlock()
                }, 0)
            }, this)))
        }
    }), Olive.View.Widget.FirstPostNotice = Backbone.View.extend({
        events: {
            click: "onTriggerClick"
        },
        onTriggerClick: function(t) {
            if ($(document.body).attr("data-is-first-post") && !Olive.Form.isDisabled(this.$el)) {
                var i = $(t.currentTarget);
                t.preventDefault(), i.removeAttr("data-pjax"), Olive.deferredAlert(null, Olive.loc("olv.portal.confirm_display_played_mark")).done(function() {
                    i.attr("data-pjax", "1");
                    var e = i.attr("data-sound");
                    i.attr("data-sound", ""), i.trigger("click"), i.attr("data-sound", e)
                }), $(document.body).removeAttr("data-is-first-post"), $.post("/settings/struct_post").fail(function() {
                    $(document.body).attr("data-is-first-post", "1")
                })
            }
        }
    }), Olive.View.Widget.Empathy = Backbone.View.extend({
        className: "post",
        events: {
            "click .empathy-button": "onEmpathyClick",
            "olv:entry:empathy:toggle": "onEmpathyToggle",
            "olv:entry:empathy:toggle:fail": "onEmpathyToggle"
        },
        isEmpathyAdded: function(e) {
            return e.hasClass("empathy-added")
        },
        onEmpathyClick: function(t) {
            var i = $(t.currentTarget);
            if (!(Olive.Form.isDisabled(i) || Olive.Guest.isGuest() || t.defaultPrevented)) {
                var o = this.isEmpathyAdded(i),
                    n = !o,
                    a = i.attr("data-action");
                return i.trigger("olv:entry:empathy:toggle", [n]), o && (a += ".delete"), Olive.Form.post(a, null, i).done(function() {
                    i.trigger("olv:entry:empathy:toggle:done", [n])
                }).fail(function() {
                    i.trigger("olv:entry:empathy:toggle:fail", [o])
                })
            }
        },
        onEmpathyToggle: function(e, t) {
            var i = $(e.target);
            this.toggleButtonStatus(i, t);
            var o;
            (o = i.hasClass("reply") ? i.closest(".reply-meta").find(".empathy-count") : i.closest(".post-meta").find(".empathy-count")).text(+o.text() + (t ? 1 : -1))
        },
        toggleButtonStatus: function(t, i) {
            t.toggleClass("empathy-added", i), t.attr("data-sound", i ? "SE_OLV_MII_ADD" : "SE_OLV_CANCEL");
            var o = t.attr("data-feeling") || "normal";
            t.find(".empathy-button-text").text(Olive.loc("olv.portal.miitoo." + o + (i ? ".delete" : "")))
        }
    }), Olive.View.Widget.ImageViewer = Backbone.View.extend({
        events: {
            "click a": "onScreenshotClick"
        },
        onScreenshotClick: function(t) {
            if (Olive.router.lockRequest) return !1;
            Olive.router.lockRequest = !0, cave.brw_notifyPageMoving()
        }
    }), Olive.View.Widget.EmpathyWithIcons = Olive.View.Widget.Empathy.extend({
        initialize: function() {
            Olive.View.Widget.Empathy.prototype.initialize.call(this);
            var t = this.$(".empathy-button"),
                i = this.isEmpathyAdded(t);
            this.updateIcons(t, i)
        },
        onEmpathyToggle: function(e, t) {
            var i = $(e.target);
            this.toggleButtonStatus(i, t), this.updateIcons(i, t)
        },
        updateIcons: function(t, i) {
            var o = $("#empathy-content"),
                n = +t.attr("data-other-empathy-count"),
                a = n > 0 ? Olive.loc_n(i ? "olv.portal.empathy.you_and_n_added" : "olv.portal.empathy.n_added", n, n) : i ? Olive.loc("olv.portal.empathy.you_added") : "";
            o.toggle(!!a), o.find(".post-permalink-feeling-text").text(a), o.find(".visitor").toggle(i), o.find(".extra").toggle(!i)
        }
    }), Olive.View.Widget.ConfirmBlacklist = Backbone.View.extend({
        events: {
            "click .unblock-button, .block-button": "onButtonClick",
            "click .cancel-button": function() {
                Olive.Browsing.goBack()
            }
        },
        onButtonClick: function(t) {
            var i = $(t.currentTarget),
                o = i.hasClass("block"),
                n = i.attr("data-action"),
                a = i.attr("data-screen-name"),
                s = o ? {
                    title: Olive.loc("olv.portal.blocklist.add"),
                    body: Olive.loc("olv.portal.blocklist.block_successed_to", a)
                } : {
                    title: Olive.loc("olv.portal.blocklist.delete"),
                    body: Olive.loc("olv.portal.blocklist.unblock_successed_to", a)
                };
            Olive.Net.ajax({
                type: "POST",
                url: n,
                lock: !0
            }).done(function() {
                Olive.alert(s.title, s.body);
                var t = i.attr("data-user-url");
                location.protocol + "//" + location.host + t === cave.history_getPrev() && cave.history_removePrev(), Olive.Browsing.replaceWith(t)
            })
        }
    }), Olive.View.Widget.Blacklist = Backbone.View.extend({
        events: {
            "click .unblock-button, .block-button": "onButtonClick"
        },
        onButtonClick: function(t) {
            var i = $(t.currentTarget),
                o = i.hasClass("block"),
                n = i.attr("data-screen-name"),
                a = o ? {
                    title: Olive.loc("olv.portal.blocklist.add"),
                    body: Olive.loc("olv.portal.blocklist.block_confirm_to.for_n3ds", n),
                    back: Olive.loc("olv.portal.back"),
                    ok: Olive.loc("olv.portal.block"),
                    done: Olive.loc("olv.portal.blocklist.block_successed_to", n)
                } : {
                    title: Olive.loc("olv.portal.blocklist.delete"),
                    body: Olive.loc("olv.portal.confirm.remove_from_blocklist_to", n),
                    back: Olive.loc("olv.portal.back"),
                    ok: Olive.loc("olv.portal.button.remove"),
                    done: Olive.loc("olv.portal.blocklist.unblock_successed_to", n)
                };
            Olive.deferredConfirm(a.title, a.body, a.back, a.ok).done(function(t) {
                if (t) {
                    var o = i.attr("data-action");
                    Olive.Form.post(o, null, i, !0).done(function() {
                        Olive.alert(a.title, a.done), Olive.Browsing.replaceWith(location.pathname)
                    }).fail(function(t, i, o, n) {
                        n && o.status && 503 !== o.status && Olive.Browsing.replaceWith(location.pathname)
                    })
                }
            })
        }
    }), Olive.View.Widget.Follow = Backbone.View.extend({
        events: {
            "click .unfollow-button, .follow-button": "onButtonClick"
        },
        onButtonClick: function(t) {
            var i = $(t.currentTarget);
            if (!(Olive.Form.isDisabled(i) || Olive.Guest.isGuest() || t.defaultPrevented)) {
                var o, n = i.hasClass("unfollow-button"),
                    a = "",
                    s = "";
                if (n) {
                    a = i.attr("data-screen-name"), s = Olive.loc("olv.portal.unfollow");
                    var r = Olive.loc("olv.portal.followlist.confirm_unfollow_to", a);
                    o = Olive.deferredConfirm(s, r, Olive.loc("olv.portal.back"), Olive.loc("olv.portal.button.remove"))
                } else o = $.Deferred().resolve(!0);
                o.done(function(t) {
                    if (t) {
                        var o = i.attr("data-action");
                        Olive.Form.post(o, null, i, !0).done(function() {
                            n && Olive.alert(s, Olive.loc("olv.portal.unfollow_succeeded_to", a)), i.addClass("none").siblings().removeClass("none"), i.hasClass("relation") && Olive.Browsing.replaceWith(location.href)
                        })
                    }
                })
            }
        }
    }), Olive.View.Widget.FavoriteButtons = Backbone.View.extend({
        events: {
            "click .favorite-button": "onFavoriteClick"
        },
        onFavoriteClick: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget);
            if (!Olive.Form.isDisabled(i)) {
                var o = i.hasClass("checked"),
                    n = i.attr(o ? "data-action-unfavorite" : "data-action-favorite");
                this.toggleFavoriteButton(i, !o), $(document.body).attr("data-is-first-favorite") && !o && Olive.deferredAlert(null, Olive.loc("olv.portal.confirm_first_favorite")).done(function() {
                    $(document.body).removeAttr("data-is-first-favorite")
                });
                var a = this;
                Olive.Form.post(n, null, i).done(function() {
                    o = !o, i.trigger("olv:community:favorite:toggle", [o])
                }).fail(function() {
                    a.toggleFavoriteButton(i, o)
                })
            }
        },
        toggleFavoriteButton: function(e, t) {
            e.toggleClass("checked", t), e.attr("data-sound", t ? "SE_OLV_CHECKBOX_CHECK" : "SE_OLV_CHECKBOX_UNCHECK")
        }
    }), Olive.View.Widget._Search = Backbone.View.extend({
        onInput: function(t) {
            var i = $(t.currentTarget),
                o = i.attr("data-action"),
                n = i.val();
            n && (i.val(""), Olive.Browsing.navigate(o + "?" + i.attr("name") + "=" + encodeURIComponent(n)))
        }
    }), Olive.View.Widget.UserSearch = Olive.View.Widget._Search.extend({
        className: "user-search-button",
        events: {
            "input .user-search-user-id": "onInput"
        }
    }), Olive.View.Widget.TitleSearch = Olive.View.Widget._Search.extend({
        className: "title-search-button",
        events: {
            "input .title-search-title-id": "onInput"
        }
    }), Olive.View.Widget.InfoTicker = Backbone.View.extend({
        events: {
            "click a[href]": "onTickerClick"
        },
        initialize: function() {
            var e = this.$el,
                t = "last-seen." + e.attr("data-olive-title-id"),
                i = +cave.ls_getItem(t) || 0,
                o = +e.attr("data-last-seen") || 0;
            o > i && (i = o, cave.ls_setItem(t, "" + i)), i < +e.attr("data-last-posted") ? e.removeClass("none") : e.remove()
        },
        onTickerClick: function(t) {
            var i = $(t.currentTarget);
            if (!Olive.Form.isDisabled(i) && !t.defaultPrevented) {
                if (i.attr("data-pjax")) {
                    var o = this;
                    $(document).one("olv:pjax:end olv:pjax:error", function() {
                        o.$el.remove()
                    })
                } else t.preventDefault(), this.$el.remove();
                var n = "last-seen." + this.$el.attr("data-olive-title-id");
                cave.ls_setItem(n, "" + Math.floor(+new Date / 1e3)), !Olive.Guest.isGuest() && this.$el.attr("data-is-of-miiverse") && $.post("/settings/miiverse_info_post")
            }
        }
    }), Olive.View.Widget.ExitOrBackButton = Backbone.View.extend({
        initialize: function() {
            var t = location.pathname,
                i = location.search,
                o = $("body").attr("data-profile-url"),
                n = new RegExp("^(/|/communities|/friend_messages|/guide/for_guest|/news/.+|" + o + "|/welcome/profile)$"),
                a = "1" === Olive.URI.getQueryVars()._cannot_back,
                s = (!n.test(t) || /^\/$/.test(t) && /^\?.*page_param=/.test(i)) && cave.history_getBackCount() > 0 && !a,
                r = Olive.Toolbar;
            r.setCornerButtonType(s ? r.buttons.BACK : r.buttons.EXIT)
        }
    }), Olive.View.Widget.ToolbarVisibility = Backbone.View.extend({
        initialize: function() {
            var t = !/^\/(?:titles\/.+\/.+\/(?:topic\/|artwork\/)?(?:post)|users\/.+\/diary\/post|posts\/.+\/reply|welcome\/(?:3ds|redesign_tutorial)?|warning\/.+|welcome|register|login|titles\/.+\/select_album_image)$/.test(location.pathname);
            Olive.Toolbar.setVisible(t)
        }
    }), Olive.View.Widget.HomeButton = Backbone.View.extend({
        initialize: function() {
            cave.home_setEnabled && (/^\/(?:titles\/.+\/.+\/(?:topic\/|artwork\/)?(?:post)|users\/.+\/diary\/post|posts\/.+\/reply)$/.test(location.pathname) ? cave.home_setEnabled(0) : cave.home_setEnabled(1))
        }
    }), Olive.View.Widget.SelectButtons = Backbone.View.extend({
        events: {
            "change select": "onSelectChange"
        },
        onSelectChange: function(e) {
            var t = $(e.currentTarget);
            this.updateLabel(t)
        },
        updateLabel: function(e) {
            var t = e[0].options[e[0].selectedIndex];
            e.siblings(".select-button-content").text(t.text)
        }
    }), Olive.View.Widget.SelectableElements = Backbone.View.extend({
        events: {
            "change select": "onSelectChange"
        },
        initialize: function() {
            var e = this;
            e.$el.find("select").each(function() {
                e.updateClass($(this))
            })
        },
        updateClass: function(e) {
            var t = !!e.val();
            e.parent().toggleClass("selected", t)
        },
        onSelectChange: function(e) {
            var t = $(e.currentTarget);
            this.updateClass(t)
        }
    }), Olive.View.Widget.URLSelector = Olive.View.Widget.SelectableElements.extend({
        onSelectChange: function(t) {
            Olive.View.Widget.SelectableElements.prototype.onSelectChange.call(this, t);
            var i = $(t.currentTarget).val();
            i && Olive.Browsing.navigate(i)
        }
    }), Olive.View.Widget.eShopJump = Backbone.View.extend({
        events: {
            click: "onClick"
        },
        onClick: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget).attr("data-dst-title-id");
            i && Olive.deferredConfirm(null, Olive.loc("olv.portal.confirm_open_eshop")).done(function(e) {
                cave.jump_toShop(1, i)
            })
        }
    }), Olive.View.Widget.CheckableControls = Backbone.View.extend({
        events: {
            "click input": "onClick"
        },
        initialize: function() {
            ("input" === this.el.tagName.toLowerCase() ? this.$el : this.$("input:checked")).each(function() {
                Olive.Form.updateParentClass(this)
            })
        },
        onClick: function(t) {
            Olive.Form.updateParentClass(t.currentTarget)
        }
    }), Olive.View.Widget.FreshPost = Backbone.View.extend({
        initialize: function() {
            var t = Olive.View.Widget.FreshPost.stock.shift();
            if (t) {
                var i = !!$("#" + t.attr("data-id")).length,
                    o = this.isInAppropriatePage(t);
                !i && o && this.insertPost(t);
                var n = +t.attr("data-requires-to-scroll");
                o && n && this.scrollToPost(t)
            }
        },
        isInAppropriatePage: function(e) {
            var t = e.attr("data-post-subtype-id"),
                i = +this.$el.attr("data-is-visitors-diary-posts");
            if ("diary_post" === t && i) return !0;
            var o = e.attr("data-olv-community-id");
            return !!o && o === this.$el.attr("data-olv-community-id")
        },
        insertPost: function(e) {
            var t = this.$el.next();
            t.length && t.hasClass("no-content-window") && t.remove(), this.el.insertAdjacentHTML("afterbegin", e.prop("text"))
        },
        scrollToPost: function(t) {
            var i = Olive.ScrollGuide.WINDOW_INNER_HEIGHT / 2 - 20,
                o = $("#" + t.attr("data-id"));
            o.length && $(document).one("olv:pagechange:end", function() {
                setTimeout(function() {
                    cave.brw_scrollImmediately(0, o.offset().top - i), o.attr("data-test-scrolled", "1")
                }, 5)
            })
        }
    }), Olive.View.Widget.FreshPost.stock = [], Olive.View.Widget.FreshReply = Olive.View.Widget.FreshPost.extend({
        isInAppropriatePage: function(e) {
            var t = e.attr("data-parent-post-id");
            return !!t && t === this.$el.attr("data-parent-post-id")
        },
        insertPost: function(e) {
            this.el.insertAdjacentHTML("beforeend", e.prop("text"))
        }
    }), Olive.View.Widget.PostScroller = Backbone.View.extend({
        events: {
            keydown: "onKeyDown"
        },
        initialize: function() {
            this.offset = 224, this.lastScrollTop = 0
        },
        onKeyDown: function(e) {
            82 === e.which ? this.scrollToNearestElement(!1) : 76 === e.which && this.scrollToNearestElement(!0)
        },
        scrollToNearestElement: function(e) {
            var t = this.$(".scroll:not(.none)"),
                i = null,
                o = this,
                n = cave.brw_getScrollTopY(),
                a = document.body.scrollHeight;
            a - n <= 460 && a - this.lastScrollTop <= 460 && (n = this.lastScrollTop), t.each(function() {
                var t = $(this),
                    a = t.offset().top - (n + o.offset);
                if (e) {
                    if (a >= 0) return !1;
                    i = t
                } else if (a > 0) return i = t, !1
            });
            var s;
            if (i) {
                var r = "a" === i[0].nodeName.toLowerCase() ? i : i.find(".scroll-focus").first(),
                    l = r.prop("type");
                "text" === l || "textarea" === l ? (r.attr("open", "false"), r.focus(), r.removeAttr("open")) : r.focus(), s = i.offset().top - o.offset, i.trigger("olv:keyhandler:scroll:element")
            } else s = e ? 0 : a, $(document.activeElement).blur(), $(document).trigger("olv:keyhandler:scroll:document");
            return window.scrollTo(0, s), this.lastScrollTop = s, i
        }
    }), Olive.View.Widget.PageReloader = Backbone.View.extend({
        events: {
            keydown: "onKeyDown"
        },
        onKeyDown: function(t) {
            89 === t.which && ($(document).trigger("olv:pagereloader:reload"), Olive.Browsing.reload())
        }
    }), Olive.View.Widget.Dropdown = Backbone.View.extend({
        className: "dropdown",
        events: {
            "click .dropdown-toggle": "onToggleClick"
        },
        initialize: function() {
            this.isOpen = this.$el.hasClass("open"), this.eventNS = ".delegateEvents" + this.cid, this.$toggle = this.$(".dropdown-toggle").first(), this.$menu = this.$(".dropdown-menu").first()
        },
        open: function(e) {
            if (!this.isOpen) {
                this.isOpen = !0, this.$el.addClass("open"), this.$el.trigger("olv:dropdown:open", [this, e || null]);
                var t = "click" + this.eventNS,
                    i = $.proxy(this.onBodyClick, this);
                setTimeout(function() {
                    $(document.body).on(t, i)
                })
            }
        },
        close: function(e) {
            this.isOpen && (this.isOpen = !1, this.$el.removeClass("open"), this.$el.trigger("olv:dropdown:close", [this, e || null]), $(document.body).off(this.eventNS))
        },
        isClosableElement: function(e) {
            for (var t = this.$menu[0]; e && e !== t; e = e.parentNode) {
                var i = e.nodeName.toLowerCase();
                if ("input" === i || "button" === i || "a" === i) return !0
            }
            return !1
        },
        onToggleClick: function(e) {
            e.preventDefault(), this.$el.hasClass("disabled") || this.isOpen || this.open(this.$toggle[0])
        },
        onBodyClick: function(e) {
            var t = e.target,
                i = this.$menu[0];
            (i !== t && !$.contains(i, t) || this.isClosableElement(t)) && this.close(t)
        },
        undelegateEvents: function() {
            this.close(), Backbone.View.prototype.undelegateEvents.call(this)
        }
    }), Olive.View.Widget.CloseTutorial = Backbone.View.extend({
        events: {
            click: "onCloseTutorialClick"
        },
        onCloseTutorialClick: function(t) {
            var i = $(t.currentTarget);
            if (i.parent().hide(), i.attr("data-tutorial-name")) Olive.Net.post("/settings/tutorial_post", {
                tutorial_name: i.attr("data-tutorial-name")
            }).done(function() {});
            else if (i.attr("data-achievement-name")) {
                var o = i.attr("data-achievement-name").split(/\s*,\s*/);
                Olive.Achievement.requestAchieveWithoutRegard(o)
            }
            t.preventDefault()
        }
    }), Olive.View.Widget.PostToBack = Backbone.View.extend({
        events: {
            submit: "onSubmit"
        },
        onSubmit: function(t) {
            t.preventDefault();
            var i = $(t.currentTarget),
                o = i.find('input[type="submit"]');
            Olive.Form.submit(i, o, !0).done(function() {
                history.back()
            })
        }
    }), Olive.View.Widget.BodyLanguageSelector = Backbone.View.extend({
        events: {
            "change select": "onSelectChange"
        },
        onSelectChange: function(e) {
            var t = $(e.currentTarget).val();
            $("#body-language-" + t).toggleClass("none", !1).siblings(".multi-language-body").toggleClass("none", !0)
        }
    }), Olive.View.Widget.MoreContentButton = Backbone.View.extend({
        events: {
            "click .more-content-button": "onMoreContentButton"
        },
        initialize: function(t) {
            var i = this.$el.find(".post-content-text");
            i && 0 != i.length && i.each(function() {
                var t = $(this),
                    i = t.text().match(/([\s\S]+)(\n+---+\n[\s\S]+)/);
                if (i) {
                    t.text(i[1]);
                    var o = $('<span class="wrapped none"></span>').text(i[2]);
                    t.append(o);
                    var n = $('<a href="#" class="more-content-button"></a>');
                    n.text(Olive.loc("olv.portal.read_more_content")), t.after(n)
                }
            })
        },
        onMoreContentButton: function(e) {
            e.preventDefault();
            var t = $(e.currentTarget);
            t.prev().find(".wrapped").removeClass("none"), t.remove()
        }
    }), Olive.View.Widget.MultipleSelectMediator = Backbone.View.extend({
        events: {
            "change select": "onChange"
        },
        initialize: function() {
            var t = this,
                i = _.map(this.$("select"), function(t) {
                    return new Olive.View.Widget.MultipleSelect({
                        el: t
                    })
                });
            this.selectsByName = _.groupBy(i, function(e) {
                return e.el.name
            }), this.$("select").each(function() {
                t.imposeDistinctRestrictionOn(this)
            })
        },
        uniq: function(e) {
            return _.chain(e).groupBy(function(e) {
                return e
            }).keys().value()
        },
        buildComplementSelector: function(e) {
            return e.map(function(e) {
                return ":not(" + e + ")"
            }).join("")
        },
        onChange: function(e) {
            this.imposeDistinctRestrictionOn(e.currentTarget)
        },
        imposeDistinctRestrictionOn: function(t) {
            var i = t.name,
                o = t.value,
                n = this.selectsByName[i],
                a = n.map(function(e) {
                    return e.getSelectedConfigurableOption()
                }).filter(function(e) {
                    return e
                }),
                s = this.uniq(a.map(function(e) {
                    return e.value
                })),
                r = n.filter(function(e) {
                    return e.el !== t
                }),
                l = {
                    enableOptionsSelector: "option" + this.buildComplementSelector(s.map(function(e) {
                        return "[value=" + e + "]"
                    }))
                };
            new Olive.View.Widget.MultipleSelect({
                el: t
            }).getSelectedConfigurableOption() && (l.disableOptionsSelector = "option[value=" + o + "]"), r.forEach(function(e) {
                e.$el.trigger("olv:select:change", l)
            })
        }
    }), Olive.View.Widget.MultipleSelect = Backbone.View.extend({
        events: {
            "olv:select:change": "onChanged"
        },
        getSelectedConfigurableOption: function() {
            return _.find(this.$el.find("option").toArray(), function(e) {
                return e.selected && e.hasAttribute("data-is-configurable")
            })
        },
        enableOptions: function(e) {
            this.$el.find(e).prop("disabled", !1)
        },
        disableOptions: function(e) {
            this.$el.find(e).prop("disabled", !0)
        },
        onChanged: function(e, t) {
            "enableOptionsSelector" in t && this.enableOptions(t.enableOptionsSelector), "disableOptionsSelector" in t && this.disableOptions(t.disableOptionsSelector)
        }
    }), Olive.View.Widget.AchievementUpdater = Backbone.View.extend({
        events: {
            "olv:achievement:update": "onAchievementUpdate"
        },
        onAchievementUpdate: function(t) {
            var i = $(t.target),
                o = i.attr("data-achievement-name");
            o && Olive.Achievement.requestAchieveWithoutRegard([o]).done(function(e) {
                i.trigger("olv:achievement:update:done", [e])
            })
        }
    }), Olive.View.Page.AlbumDetail = Olive.View.Page.Common.extend({
        events: {
            "click .js-album-delete-button": "onDeleteAlbumClick"
        },
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.widgets.push(new Olive.View.Widget.URLSelector({
                el: $("#post-target-selector")
            }))
        },
        onDeleteAlbumClick: function(t) {
            var i = $(t.currentTarget.form),
                o = $(t.currentTarget).find(".js-album-delete-button");
            Olive.Form.isDisabled(o) || t.defaultPrevented || (t.preventDefault(), Olive.confirm(null, Olive.loc("olv.portal.album.delete_confirm")) && Olive.Form.submit(i, o, !0).done(function(e) {
                history.back()
            }))
        }
    }), Olive.View.Widget.CreateDiaryOrSaveScreenshotWindow = Backbone.View.extend({
        events: {
            "click .js-edit-diary-button": "onPostDiaryClick",
            "click .js-save-album-button": "onSaveScreenshotClick"
        },
        initialize: function() {
            if (!!+this.$el.attr("data-can-create")) {
                var e = this.setupScreenshotSelector();
                e.hasImage && this.$el.toggleClass("no-screenshots", !1);
                var t = this;
                e.loadDeferred.then(function() {
                    t.toggleActionEnabled(!0)
                })
            }
            this.$el.toggleClass("none", !1)
        },
        toggleActionEnabled: function(e) {
            if (!!!+this.$el.attr("data-is-readonly") || !e) {
                var t = this.$el.find(".js-edit-diary-button"),
                    i = this.$el.find(".js-save-album-button");
                t.toggleClass("disabled", !e), i.toggleClass("disabled", !e)
            }
        },
        setupScreenshotSelector: function() {
            var t = this.$el.find(".js-diary-screenshot-window-image-container").find(".js-screenshot-capture-button"),
                i = [];
            t.each(function(t, o) {
                var n = $(o),
                    a = Olive.Screenshot[n.hasClass("js-upside") ? "SCREEN_UPSIDE" : "SCREEN_DOWNSIDE"];
                if (Olive.Screenshot.isEnabled(a)) {
                    var s = Olive.Screenshot.retrieveImagePath(a);
                    if (s) {
                        var r = n.find("img"),
                            l = $.Deferred();
                        r.one("load", function() {
                            setTimeout(l.resolve, 300)
                        }), i.push(l), r.prop("src", s), n.find('input[type="radio"]').prop("disabled", !1)
                    }
                }
            });
            var o, n = i.length > 0;
            if (n) {
                for (var a = 0, s = t.length; a < s; a++) {
                    var r = t.eq(a).find('input[type="radio"]');
                    if (!r.prop("disabled")) {
                        r.prop("checked", !0), Olive.Form.updateParentClass(r.get(0));
                        break
                    }
                }
                o = $.when.apply($, i)
            } else(o = $.Deferred()).resolve();
            return {
                hasImage: n,
                loadDeferred: o
            }
        },
        getSelectedScreenshotTarget: function() {
            return this.$el.find(".js-diary-screenshot-window-image-container").find(".checked").find('input[type="radio"]').attr("value")
        },
        setSelectedScreenshot: function() {
            var e = this.$('[name="screenshot"]'),
                t = this.getSelectedScreenshotTarget();
            e.prop("disabled", !1).attr("lls", t), e.focus(), e.trigger("click"), e.blur()
        },
        onPostDiaryClick: function(t) {
            t.preventDefault();
            var i = this.$el.find(".js-edit-diary-button");
            if (!Olive.Form.isDisabled(i)) {
                this.toggleActionEnabled(!1);
                var o = i.attr("href").split("?")[0] + "?lls=" + this.getSelectedScreenshotTarget();
                Olive.Browsing.navigate(o)
            }
        },
        onSaveScreenshotClick: function(t) {
            t.preventDefault();
            var i = this.$el.find(".js-save-album");
            Olive.Form.isDisabled(i.find(".js-save-album-button")) || (this.toggleActionEnabled(!1), this.setSelectedScreenshot(), Olive.Loading.lock(), i.submit())
        }
    }), Olive.View.Widget.ConfirmAlbum = Backbone.View.extend({
        events: {
            "click .js-return-to-game-button": "onReturnToGameClick"
        },
        onReturnToGameClick: function() {
            setTimeout(function() {
                cave.jump_toSuspendedApplication()
            }, 0)
        }
    }), Olive.View.Widget.CloseTopicPost = Backbone.View.extend({
        events: {
            "click .js-close-topic-post-button": "onCloseTopicPostClick"
        },
        onCloseTopicPostClick: function(t) {
            var i = $(t.currentTarget.form),
                o = $(t.currentTarget).find(".js-close-topic-post-button");
            Olive.Form.isDisabled(o) || t.defaultPrevented || (t.preventDefault(), Olive.confirm(Olive.loc("olv.portal.edit.action.close_topic_post"), Olive.loc("olv.portal.edit.action.close_topic_post.confirm"), Olive.loc("olv.portal.stop"), Olive.loc("olv.portal.yes")) && Olive.Form.submit(i, o, !0).done(function(t) {
                Olive.Browsing.replaceWith(location.pathname)
            }))
        }
    }), Olive.View.Page.PostFormAlbumSelector = Olive.View.Page.Common.extend({
        initialize: function() {
            Olive.View.Page.Common.prototype.initialize.call(this), this.oliveTitleId = $(".js-album-image-list").attr("data-olive-title-id"), this.lockingForBack = !1
        },
        events: {
            "click .js-select-album-image": "onSelectAlbumImage",
            "click .cancel-button": function() {
                Olive.Browsing.goBack()
            }
        },
        onSelectAlbumImage: function(t) {
            if (t.preventDefault(), !this.lockingForBack) {
                this.lockingForBack = !0;
                var i = $(t.target);
                Olive.View.Page.PostFormAlbumSelector.stock.push({
                    oliveTitleId: this.oliveTitleId,
                    albumImageId: i.attr("data-album-image-id"),
                    previewUrl: i.attr("data-album-image-preview-src")
                }), history.back()
            }
        }
    }), Olive.View.Page.PostFormAlbumSelector.stock = [], Olive.Content = Olive.Content || {}, Olive.Content.replaceBody = function(e) {
        var t = $("#body"),
            i = $("<div>").html(e).find("#body");
        document.body.replaceChild(i[0], t[0])
    }, Olive.Form = {
        toggleDisabled: function(t, i) {
            var o = void 0 === i;
            return t.each(function() {
                var t = $(this),
                    n = o ? !Olive.Form.isDisabled(t) : i;
                if (t.toggleClass("disabled", n), void 0 !== this.form) t.prop("disabled", n);
                else {
                    var a = n ? "href" : "data-disabled-href",
                        s = n ? "data-disabled-href" : "href",
                        r = t.attr(a);
                    void 0 !== r && (t.removeAttr(a), t.attr(s, r))
                }
            }), t
        },
        isDisabled: function(e) {
            return e.length && void 0 !== e[0].form ? e.prop("disabled") : e.hasClass("disabled")
        },
        disable: function(t, i) {
            return Olive.Form.toggleDisabled(t, !0), i.always(function() {
                Olive.Form.toggleDisabled(t, !1)
            }), t
        },
        submit: function(e, t, i, o) {
            e.trigger("olv:form:submit", [t || $()]);
            var n = e.serializeArray(),
                a = t && t.is("input, button") && t.prop("name");
            a && n.push({
                name: a,
                value: t.val()
            });
            var s = {
                type: e.prop("method"),
                url: e.attr("action"),
                data: n,
                lock: i
            };
            return o || (s.headers = {
                "X-Requested-With": ""
            }), this.send(s, t)
        },
        get: function(e, t, i, o) {
            var n = {
                type: "GET",
                url: e,
                data: t,
                lock: o
            };
            return this.send(n, i)
        },
        post: function(e, t, i, o) {
            var n = {
                type: "POST",
                url: e,
                data: t,
                lock: o
            };
            return this.send(n, i)
        },
        send: function(t, i) {
            var o = Olive.Net.ajax(t);
            return $(document).trigger("olv:form:send", [o, t, i || $()]), i && (Olive.Form.disable(i, o), i.addClass("loading"), o.always(function() {
                i.removeClass("loading")
            })), o
        },
        updateParentClass: function(e) {
            switch (e.type) {
                case "radio":
                    var t;
                    if (e.form) {
                        var i = e.form.elements[e.name];
                        t = i.length ? $(Array.prototype.slice.call(i)) : $(i)
                    } else t = $('input[name="' + e.name + '"]');
                    t.each(function() {
                        $(this).parent().toggleClass("checked", this.checked)
                    });
                    break;
                case "checkbox":
                    $(e).parent().toggleClass("checked", e.checked)
            }
        },
        setup: function() {
            $(document).on("olv:form:send", function(t, i, o) {
                "POST" === (o.type || "").toUpperCase() && Olive.Pjax.cacheClear()
            })
        },
        reset: function(t) {
            t.each(function() {
                this.reset(), $(this).find("input").each(function() {
                    Olive.Form.updateParentClass(this)
                })
            })
        },
        serializeUserInputs: function(e) {
            var t = {};
            return e.$("[data-save-user-input]").each(function() {
                var e = $(this);
                if ("checkbox" !== e.attr("type") && "radio" !== e.attr("type") || e.prop("checked")) {
                    var i = '[name="' + e.attr("name") + '"]';
                    t[i] = e.val()
                }
            }), t
        },
        fillInputsWithSerializedObject: function(t, i) {
            for (var o in i) {
                var n = i[o],
                    a = t.$(o);
                "checkbox" === a.attr("type") || "radio" === a.attr("type") ? (a.prop("checked", !1).filter('[value="' + n + '"]').prop("checked", !0), Olive.Form.updateParentClass(a.get(0))) : a.val(n)
            }
        }
    }, Olive.Form.setup(), Olive.Guest = {
        isGuest: function() {
            return $("#body").hasClass("guest")
        }
    }, Olive.Sound = {
        defaultActivationSound: "SE_OLV_OK",
        playActivationSound: function(e) {
            var t = e.attr("data-sound");
            "" !== t && this.playSound(t || this.defaultActivationSound)
        },
        playSound: function(e) {
            cave.snd_playSe(e)
        },
        playBGM: function(e) {
            cave.snd_playBgm(e)
        },
        playBGMByPath: function(e) {
            var t = /^\/welcome\//.test(e) ? "BGM_CAVE_SYOKAI" : /^\/(?:settings(?:\/|$)|help\/|guide\/)/.test(e) ? "BGM_CAVE_SETTING" : "BGM_CAVE_MAIN";
            this.playBGM(t)
        },
        activationTarget: null,
        onPreActivate: function(e) {
            for (var t = !1, i = e.target, o = document.body; i && i !== o; i = i.parentNode) {
                var n = i.nodeName.toLowerCase();
                if ("a" === n) {
                    t = !!i.href;
                    break
                }
                if ("input" === n) {
                    var a = i.type;
                    t = "text" !== a && "password" !== a && "file" !== a && !i.disabled;
                    break
                }
                if ("button" === n) {
                    t = !i.disabled;
                    break
                }
                if ("textarea" === n || "select" === n) break;
                var s = " " + i.className + " ";
                if (s.indexOf(" trigger ") >= 0) {
                    t = s.indexOf(" disabled ") < 0;
                    break
                }
            }
            this.activationTarget = t ? i : null
        },
        onActivate: function(e) {
            var t = this.activationTarget;
            this.activationTarget = null, t && this.playActivationSound($(t))
        },
        onPageChange: function() {
            this.playBGMByPath(location.pathname)
        },
        onScrollElement: function() {
            this.playSound("SE_WAVE_SCROLL_PAGE_LR")
        },
        onScrollDocument: function() {
            this.playSound("SE_WAVE_SCROLL_LIMIT_LR")
        },
        onPageReload: function(e) {
            this.playSound("SE_OLV_RELOAD")
        },
        onDropdownOpen: function(e, t, i) {
            t.$toggle.attr("data-sound", "SE_OLV_BALLOON_OPEN")
        },
        onDropdownClose: function(e, t, i) {
            t.$toggle.attr("data-sound", "SE_OLV_BALLOON_CLOSE"), this.activationTarget || this.playSound("SE_OLV_BALLOON_CLOSE")
        },
        setup: function() {
            document.addEventListener("click", $.proxy(this.onPreActivate, this), !0), document.addEventListener("click", $.proxy(this.onActivate, this), !1);
            var e = $(document);
            e.on("olv:pagechange:ready", $.proxy(this.onPageChange, this)), this.onPageChange(), e.on("olv:keyhandler:scroll:element", $.proxy(this.onScrollElement, this)), e.on("olv:keyhandler:scroll:document", $.proxy(this.onScrollDocument, this)), e.on("olv:pagereloader:reload", $.proxy(this.onPageReload, this)), e.on("olv:dropdown:open", $.proxy(this.onDropdownOpen, this)), e.on("olv:dropdown:close", $.proxy(this.onDropdownClose, this))
        }
    }, Olive.Sound.setup(), Olive.ScrollGuide = {
        WINDOW_INNER_HEIGHT: 480,
        activate: function() {
            var e = this,
                t = history.state ? history.state.id : null;
            $(document).one("olv:router:dispatch:end", function() {
                setTimeout(function() {
                    var i = history.state ? history.state.id : null;
                    document.body.clientHeight > e.WINDOW_INNER_HEIGHT && cave.brw_getScrollTopY() <= 0 && t === i && e.show()
                }, 1500)
            })
        },
        show: function() {
            Olive.Toolbar.isVisible() ? cave.effect_setScrollGuideOffsetPos(0, 28) : cave.effect_setScrollGuideOffsetPos(0, 0), cave.effect_scrollGuide(1)
        },
        hide: function() {
            cave.effect_scrollGuide(0)
        }
    }, Olive.URI = {
        getQueryVars: function() {
            for (var e, t = {}, i = window.location.href, o = i.slice(i.indexOf("?") + 1).split("&"), n = 0; n < o.length; n++) e = o[n].split("="), t[decodeURIComponent(e[0])] = decodeURIComponent(e[1]);
            return t
        },
        origin: function() {
            return location.protocol + "//" + location.host
        }
    }, Olive.Achievement = {
        requestAchieveWithoutRegard: function(e) {
            var t = $.Deferred();
            return this.requestAchieve(e).always(function() {
                t.resolveWith(this, arguments)
            }), t.promise()
        },
        requestAchieve: function(t) {
            return Olive.Net.ajax({
                type: "POST",
                url: "/my/achievements.json",
                contentType: "application/json",
                data: JSON.stringify({
                    achievements: t
                }),
                silent: !0,
                lock: !0
            })
        }
    }, Olive.Screenshot = {
        SCREEN_UPSIDE: 0,
        SCREEN_DOWNSIDE: 1,
        isEnabled: function(e) {
            return void 0 === cave.capture_isEnabledEx ? cave.capture_isEnabled() : cave.capture_isEnabledEx(e)
        },
        isEnabledAnySide: function() {
            return this.isEnabled(this.SCREEN_UPSIDE) || this.isEnabled(this.SCREEN_DOWNSIDE)
        },
        retrieveImagePath: function(e) {
            if (e === this.SCREEN_UPSIDE) return cave.lls_setCaptureImage("upside", 3), cave.lls_getPath("upside");
            if (e === this.SCREEN_DOWNSIDE) return cave.lls_setCaptureImage("downside", 0), cave.lls_getPath("downside");
            throw new Error("Invalid screen id")
        }
    }, Olive.UpdateChecker = function(e) {
        this._settings = {}, this.delay_ = e || 1e3, this.timeout_ = null, this.pjaxLoadLog = ""
    }, Olive.UpdateChecker.getInstance = function() {
        return void 0 == Olive.UpdateChecker.instance && (Olive.UpdateChecker.instance = new Olive.UpdateChecker(1e3)), Olive.UpdateChecker.instance
    }, Olive.UpdateChecker.prototype.invoke = function() {
        this.timeout_ = setTimeout($.proxy(function() {
            this.callback_(), this.clearTimeout()
        }, this), this.delay_)
    }, Olive.UpdateChecker.prototype.clearTimeout = function() {
        clearTimeout(this.timeout_)
    }, Olive.UpdateChecker.prototype.callback_ = function() {
        var t = {};
        $.each(this._settings, $.proxy(function(e) {
            void 0 != this._settings[e].pathname && this._settings[e].pathname != location.pathname ? delete this._settings[e] : $.each(this._settings[e].params, function(e, i) {
                t[e] = JSON.stringify(i)
            })
        }, this)), this.pjaxLoadLog && (t.times = this.pjaxLoadLog), Olive.Net.ajax({
            url: "/check_update.json",
            data: t,
            silent: !0,
            cache: !1
        }).done($.proxy(function(e) {
            $(document).triggerHandler("olv:updatechecker:update", [e])
        }, this))
    }, Olive.UpdateChecker.prototype.onUpdate = function(e, t, i, o) {
        this._settings[e] = {
            params: t,
            update: i
        }, o && (this._settings[e].pathname = location.pathname)
    }, Backbone.History.prototype.loadUrl = function(e) {
        var t = ((this.fragment = this.getFragment(e)) || "").replace(/\?.*/, "");
        return _.any(this.handlers, function(e) {
            if (e.route.test(t)) return e.callback(t), !0
        })
    }, Backbone.History.prototype.getFragment = function(e, t) {
        if (null == e)
            if (this._hasPushState || !this._wantsHashChange || t) {
                e = this.location.pathname + this.location.search;
                var i = this.root.replace(/\/$/, "");
                e.indexOf(i) || (e = e.slice(i.length))
            } else e = this.getHash();
        return e.replace(/^\/+/, "")
    }, Olive.Router = Backbone.Router.extend({
        isReverting: !1,
        lockRequest: !1,
        initialize: function() {
            this.on("route", function() {
                Olive.History.state = history.state
            })
        },
        navigate: function(t, i) {
            if (!this.lockRequest) {
                Olive.History.isInitialLoad || (this.lockRequest = !0);
                var o = t.replace(Olive.URI.origin(), "").replace(Backbone.history.options.root, "");
                if (i && !0 !== i || (i = {
                        trigger: !!i
                    }), Olive.Pjax.isEnabled) {
                    var n = _.extend({}, history.state, {
                        scrollTo: cave.brw_getScrollTopY()
                    });
                    window.history.replaceState(n, null), Olive.History.needToSetState && (history.state = n), Olive.Router.prototype._isSameUrl(n.url, t) && (console.log("Replacing: " + n.url + " -> " + t), i.replace = !0);
                    var a = {
                        id: Olive.Pjax.uniqueId(),
                        url: t,
                        fragment: o,
                        scrollTo: 0,
                        replace: !!i.replace
                    };
                    Backbone.Router.prototype.navigate.call(this, o, _.extend({}, i, {
                        trigger: !1
                    })), window.history.replaceState(a, null, t), Olive.History.needToSetState && (history.state = a), i.trigger && Backbone.history.loadUrl(o), Olive.History.isInitialLoad = !1
                } else Backbone.Router.prototype.navigate.call(this, o, i)
            }
        },
        route: function(t, i, o) {
            return _.isFunction(i) || o || (o = this[i]), Backbone.Router.prototype.route.call(this, t, i, function() {
                function t() {
                    Olive.Router.prototype._isSameUrl(r, history.state.url) ? o && o.apply(n, a) : Olive.Router.prototype._routeManually(Backbone.history.getFragment()), $(document).trigger("olv:router:dispatch:end")
                }
                var n = this,
                    a = arguments;
                if (n.isReverting) return n.isReverting = !1, void $(document).trigger("olv:pagechange:end");
                console.log("Routing: " + Backbone.history.fragment + " -> " + i);
                var s = Olive.History.state ? Olive.History.state.id > history.state.id ? "back" : history.state.replace ? "replace" : "forward" : void 0,
                    r = history.state.url;
                Olive.History.isInitialLoad ? t() : Olive.Pjax.go(history.state.url, {
                    direction: s,
                    cacheId: history.state.id
                }).done(t)
            })
        },
        _isSameUrl: function(e, t) {
            return e && t && e.replace(/%20/g, "+") === t.replace(/%20/g, "+")
        },
        _routeManually: function(t) {
            var i, o = (t || "").replace(/\?.*/, ""),
                n = _.find(this.routes, function(e, t) {
                    return (i = Backbone.Router.prototype._routeToRegExp(t)).test(o)
                }),
                a = Backbone.Router.prototype._extractParameters(i, o);
            _.isFunction(n) ? n.apply(Olive.router, a) : this[n] && this[n].apply(Olive.router, a)
        }
    }), Olive.Router = Olive.Router.extend({
        routes: {
            "": "activity",
            communities: "communities",
            "communities/categories/:category": "communities",
            "communities/favorites": "communities",
            identified_user_posts: "identifiedUserPosts",
            "titles/:titleId/:communityId/post": "postForm",
            "titles/:titleId/:communityId/topic/post": "postForm",
            "titles/:titleId/:communityId/artwork/post": "postForm",
            "titles/:titleId/:communityId/post_memo": "postMemo",
            "titles/:titleId/:communityId/artwork/post_memo": "postMemo",
            "titles/:titleId/select_album_image": "postFormAlbumSelector",
            "users/:userId/diary/post_memo": "postMemo",
            post_memo: "postMemo",
            "titles/:titleId/:communityId": "community",
            "titles/:titleId/:communityId/new": "community",
            "titles/:titleId/:communityId/hot": "community",
            "titles/:titleId/:communityId/diary": "community",
            "titles/:titleId/:communityId/topic": "community",
            "titles/:titleId/:communityId/topic/new": "community",
            "titles/:titleId/:communityId/topic/open": "community",
            "titles/:titleId/:communityId/artwork": "community",
            "titles/:titleId/:communityId/artwork/new": "community",
            "titles/:titleId/:communityId/artwork/hot": "community",
            "titles/:titleId/:communityId/in_game": "community",
            "titles/:titleId/:communityId/old": "community",
            "titles/search": "titleSearch",
            "posts/:postId": "post",
            "posts/:postId/reply": "replyForm",
            "posts/:postId/violations.create": "violation",
            "replies/:postId/violations.create": "violation",
            "posts/:postId/edit": "editForm",
            "replies/:postId/edit": "editForm",
            posts: "postProcess",
            diary_posts: "postProcess",
            artwork_posts: "postProcess",
            topic_posts: "postProcess",
            "posts/:postId/replies": "postProcess",
            "replies/:postId": "reply",
            "users/:userId": "user",
            "users/:userId/posts": "user",
            "users/:userId/diary": "userDiary",
            "users/:userId/diary/post": "postDiaryForm",
            "users/:userId/empathies": "user",
            "users/:userId/following": "user",
            "users/:userId/followers": "user",
            "users/:userId/violators.create": "violation",
            "users/:userId/blacklist.confirm": "confirmBlacklist",
            "users/:userId/album/:albumImageId": "albumDetail",
            "users/:userId/album.confirm": "confirmAlbum",
            "settings/account": "accountSettings",
            "settings/profile": "profileSettings",
            "settings/:page": "settings",
            "settings/titles/:titleId": "settings",
            "admin_messages.post": "violation",
            my_blacklist: "blacklist",
            "welcome/(3ds)": "welcome",
            "welcome/profile": "welcomeProfile",
            welcome_guest: "guestWelcome",
            welcome: "welcomePage",
            "welcome/favorite_community_visibility": "welcomeFavoriteCommunityVisibility",
            users: "users",
            "news/my_news": "my_news",
            "warning/:page": "warning",
            "error/post_form/:page": "errorPostForm",
            "help/(:page)": "help",
            "guide/(:page)": "guide",
            "*path": "defaultRoute"
        },
        defaultRoute: function(t) {
            new Olive.View.Page.Common({
                el: "body"
            })
        },
        activity: function() {
            new Olive.View.Page.Activity({
                el: "body"
            })
        },
        communities: function() {
            new Olive.View.Page.Communities({
                el: "body"
            })
        },
        postForm: function() {
            new Olive.View.Page.PostForm({
                el: "body"
            })
        },
        postDiaryForm: function() {
            new Olive.View.Page.PostDiaryForm({
                el: "body"
            })
        },
        replyForm: function() {
            new Olive.View.Page.ReplyForm({
                el: "body"
            })
        },
        postMemo: function() {
            new Olive.View.Page.PostMemo({
                el: "body"
            })
        },
        postProcess: function() {
            new Olive.View.Page.PostRedirection({
                el: "body"
            })
        },
        postFormAlbumSelector: function() {
            new Olive.View.Page.PostFormAlbumSelector({
                el: "body"
            })
        },
        violation: function() {
            new Olive.View.Page.Violation({
                el: "body"
            })
        },
        editForm: function() {
            new Olive.View.Page.EditForm({
                el: "body"
            })
        },
        post: function() {
            new Olive.View.Page.Post({
                el: "body"
            })
        },
        reply: function() {
            new Olive.View.Page.Reply({
                el: "body"
            })
        },
        community: function() {
            new Olive.View.Page.Community({
                el: "body"
            })
        },
        titleSearch: function() {
            new Olive.View.Page.TitleSearch({
                el: "body"
            })
        },
        user: function() {
            new Olive.View.Page.User({
                el: "body"
            })
        },
        userDiary: function() {
            new Olive.View.Page.UserDiary({
                el: "body"
            })
        },
        settings: function() {
            new Olive.View.Page.Settings({
                el: "body"
            })
        },
        accountSettings: function() {
            new Olive.View.Page.AccountSettings({
                el: "body"
            })
        },
        profileSettings: function() {
            new Olive.View.Page.ProfileSettings({
                el: "body"
            })
        },
        users: function() {
            new Olive.View.Page.Users({
                el: "body"
            })
        },
        blacklist: function() {
            new Olive.View.Page.Blacklist({
                el: "body"
            })
        },
        confirmBlacklist: function() {
            new Olive.View.Page.ConfirmBlacklist({
                el: "body "
            })
        },
        identifiedUserPosts: function() {
            new Olive.View.Page.IdentifiedUserPosts({
                el: "body"
            })
        },
        my_news: function() {
            new Olive.View.Page.MyNews({
                el: "body"
            })
        },
        welcome: function() {
            new Olive.View.Page.Welcome({
                el: "body"
            })
        },
        guestWelcome: function() {
            new Olive.View.Page.GuestWelcome({
                el:"body"
            })
        },
        welcomeProfile: function() {
            new Olive.View.Page.WelcomeProfile({
                el: "body"
            })
        },
        welcomePage: function() {
            new Olive.View.Page.Common({
                el: "body"
            })
        },
        welcomeFavoriteCommunityVisibility: function() {
            new Olive.View.Page.WelcomeFavoriteCommunityVisibility({
                el: "body"
            })
        },
        warning: function() {
            new Olive.View.Page.Warning({
                el: "body"
            })
        },
        help: function() {
            new Olive.View.Page.Help({
                el: "body"
            })
        },
        guide: function() {
            new Olive.View.Page.Common({
                el: "body"
            }), $(".guide-exit-button").length && Olive.Toolbar.setVisible(!1), Olive.ScrollGuide.activate()
        },
        albumDetail: function() {
            new Olive.View.Page.AlbumDetail({
                el: "body"
            })
        },
        confirmAlbum: function() {
            new Olive.View.Page.ConfirmAlbum({
                el: "body "
            })
        },
        errorPostForm: function() {
            new Olive.View.Page.PostFormError({
                el: "body"
            })
        },
    }))
}).call(this, Olv);
