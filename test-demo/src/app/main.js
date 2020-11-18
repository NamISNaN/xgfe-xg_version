/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 16:22:35
 * @LastEditTime: 2019-08-12 22:00:31
 * @LastEditors: Please set LastEditors
 */
/**
 * @file main.js
 * @author yuebin (yuebin@meituan.com)
 * @description 项目加载根文件，require等配置文件
 */
/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */
/* eslint no-empty: 0 */

// for global url
// 用作后端数据请求路径的base
window.basePath = '';

// 用作前端静态资源请求路径的base
window.baseUrl = '/assets/';
window.ver = '${__timestamp__}';
// 系统版本号
window.appVersion = 'v3.5.3.0.0';
// 配置分组cookie
if (GROUP_PLUS_ENV) {
    let exp = new Date();
    // 过期时间 365天
    exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `group=${GROUP_PLUS_ENV};path=/;expires=${exp.toGMTString()}`;
}

// Require JS  Config File

require.config(__inline('require.config.json'));

require(['appInit'], function (app) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, [app.name, function () {
            angular.element(document).find('html').addClass('ng-app');
        }], {
            strictDi: true
        });
    });
});
