// Generated by CoffeeScript 1.6.3
(function() {
  var ConnectionMonitor, Notification, TerminalProxy,
    __slice = [].slice;

  window.Pipe = new window.PipeServerClass(pipe_name);

  TerminalProxy = (function() {
    function TerminalProxy(server_pipe) {
      this.server_pipe = server_pipe;
    }

    TerminalProxy.prototype.onCommand = function(command) {
      return this.t.exec(command);
    };

    TerminalProxy.prototype.bind = function(t) {
      this.t = t;
      this.server_pipe.registerRPC("do_login", this.do_login.bind(this));
      this.server_pipe.registerRPC("command", this.onCommand.bind(this));
      this.server_pipe.registerRPC("request_user", this.request_user.bind(this));
      this.server_pipe.registerRPC("request_player_status", this.request_player_status.bind(this));
      this.server_pipe.registerRPC("request_command_list", this.request_command_list.bind(this));
      return window.T = this;
    };

    TerminalProxy.prototype.echo = function(msg, option) {
      return this.server_pipe.fireRPC("echo", [msg, option]);
    };

    TerminalProxy.prototype.error = function() {
      var msg, _ref;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.server_pipe).fireRPC.apply(_ref, ["error"].concat(__slice.call(msg)));
    };

    TerminalProxy.prototype.set_prompt = function() {
      var prompt, _ref;
      prompt = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.server_pipe).fireRPC.apply(_ref, ["set_prompt"].concat(__slice.call(prompt)));
    };

    TerminalProxy.prototype.pause = function() {
      return this.server_pipe.fireRPC("pause");
    };

    TerminalProxy.prototype.resume = function() {
      return this.server_pipe.fireRPC("resume");
    };

    TerminalProxy.prototype.clear = function() {
      return this.server_pipe.fireRPC("clear");
    };

    TerminalProxy.prototype.init_ui = function() {
      var song, _ref;
      song = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.server_pipe).fireRPC.apply(_ref, ["init_ui"].concat(__slice.call(song)));
    };

    TerminalProxy.prototype.update_ui = function() {
      var sound, _ref;
      sound = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (_ref = this.server_pipe).fireRPC.apply(_ref, ["update_ui"].concat(__slice.call(sound)));
    };

    TerminalProxy.prototype.login_begin = function() {
      return this.server_pipe.fireRPC("login_begin");
    };

    TerminalProxy.prototype.login_succ = function(user) {
      return this.server_pipe.fireRPC("login_succ", user);
    };

    TerminalProxy.prototype.login_fail = function(user) {
      return this.server_pipe.fireRPC("login_fail", user);
    };

    TerminalProxy.prototype.do_login = function(info) {
      var _ref,
        _this = this;
      return (_ref = window.DoubanFM) != null ? _ref.login(info.username, info.password, info.remember, function(user) {
        return _this.login_succ(user);
      }, function(user) {
        return _this.login_fail(user);
      }) : void 0;
    };

    TerminalProxy.prototype.request_user = function() {
      return this.server_pipe.fireRPC("set_user", window.TERM.user);
    };

    TerminalProxy.prototype.request_player_status = function() {
      var _ref, _ref1;
      if (((_ref = window.DoubanFM) != null ? (_ref1 = _ref.player) != null ? _ref1.currentSong : void 0 : void 0) != null) {
        return this.update_ui(window.DoubanFM.player.currentSoundInfo());
      }
    };

    TerminalProxy.prototype.request_command_list = function() {
      var _ref;
      return this.server_pipe.fireRPC("set_command_list", (_ref = window.Help) != null ? _ref.getCommandList() : void 0);
    };

    return TerminalProxy;

  })();

  if (window.TerminalProxy == null) {
    window.TerminalProxy = new TerminalProxy(window.Pipe);
  }

  Notification = (function() {
    Notification.prototype.notify = function(msg, title, picture, timeout) {
      var notif;
      if (picture == null) {
        picture = "radio.png";
      }
      if (timeout == null) {
        timeout = 5000;
      }
      notif = webkitNotifications.createNotification(picture != null ? picture : "", title != null ? title : "", msg != null ? msg : "");
      notif.show();
      return window.setTimeout(function() {
        return notif.cancel();
      }, timeout);
    };

    Notification.prototype.onPlay = function(song) {
      return this.notify(song.title, "<" + song.albumtitle + "> " + song.artist, song.picture);
    };

    function Notification() {
      window.DoubanFM.player.onPlayCallback = this.onPlay.bind(this);
    }

    return Notification;

  })();

  window.Notification = new Notification();

  ConnectionMonitor = (function() {
    ConnectionMonitor.prototype.onErrorOccurred = function(e) {
      var _ref, _ref1;
      console.log("Connection failure");
      console.log(e);
      window.Notification.notify(e.error, "Connection Problem");
      if ((typeof window !== "undefined" && window !== null ? (_ref = window.DoubanFM) != null ? (_ref1 = _ref.player) != null ? _ref1.currentSong : void 0 : void 0 : void 0) != null) {
        return window.DoubanFM.next();
      }
    };

    ConnectionMonitor.prototype.onCompleted = function(e) {
      console.log("Complete");
      return console.log(e);
    };

    function ConnectionMonitor() {
      var filter,
        _this = this;
      filter = {
        urls: ["http://www.douban.com/j/app/*", "http://*.douban.com/*.mp?"]
      };
      chrome.webRequest.onErrorOccurred.addListener(function(e) {
        return _this.onErrorOccurred(e);
      }, filter);
      chrome.webRequest.onCompleted.addListener(function(e) {
        return _this.onCompleted(e);
      }, filter);
    }

    return ConnectionMonitor;

  })();

  window.ConnectionMonitor = new ConnectionMonitor();

}).call(this);

/*
//@ sourceMappingURL=Host.map
*/
