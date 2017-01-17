/**
 * Created by WittBulter on 2017/1/17.
 */
import SimpleMDE from './simplemde'

(function(){
	if (typeof module === "object") return module.exports = SimpleMDE;

	if (typeof define === "function" && define.amd ) define('SimpleMDE',[], () => SimpleMDE);

	window.SimpleMDE = SimpleMDE;
})()

