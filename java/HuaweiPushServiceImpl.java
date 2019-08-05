package com.ruobilin.platform.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.MessageFormat;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.io.IOUtils;

import util.LogsUtil;
import util.Utils;

import com.ruobilin.platform.common.ATC;

/**
 * 华为推送
 * 
 * @author Jiangxz
 * 
 */
public class HuaweiPushServiceImpl {
	private String sTokenUrl = "https://login.cloud.huawei.com/oauth2/v2/token"; // 获取认证Token的URL
	private String sApiUrl = "https://api.push.hicloud.com/pushsend.do"; // 应用级消息下发API

	// 发送Push消息
	public String sendMessage(String configure, String pushtoken, String userId, String message) {
		try {
			JSONObject jsonObj = JSONObject.fromObject(configure);
			String sAppId = jsonObj.getString("AppId"); // 用户在华为开发者联盟申请的appId和appSecret（会员中心->我的产品，点击产品对应的Push服务，点击“移动应用详情”获取）
			String sAppSecret = jsonObj.getString("AppSecret");
			String sTitle = jsonObj.getString("Title");// 产品标题
			String sPackageName = jsonObj.getString("PackageName");
			String sAccessToken = this.getAccessToken(sAppId, sAppSecret);
			JSONArray aDeviceTokens = new JSONArray();// 目标设备Token
			aDeviceTokens.add(pushtoken);

			JSONObject oBody = new JSONObject();// 仅通知栏消息需要设置标题和内容，透传消息key和value为用户自定义
			oBody.put("title", sTitle);// 消息标题
			oBody.put("content", message);// 消息内容体

			JSONObject oParam = new JSONObject();
			oParam.put("appPkgName", sPackageName);// 定义需要打开的appPkgName

			JSONObject oAction = new JSONObject();
			oAction.put("type", 3);// 类型3为打开APP，其他行为请参考接口文档设置
			oAction.put("param", oParam);// 消息点击动作参数

			JSONObject oMsg = new JSONObject();
			oMsg.put("type", 3);// 3: 通知栏消息，异步透传消息请根据接口文档设置
			oMsg.put("action", oAction);// 消息点击动作
			oMsg.put("body", oBody);// 通知栏消息body内容

			JSONObject oExt = new JSONObject();// 扩展信息，含BI消息统计，特定展示风格，消息折叠。
			oExt.put("biTag", "Trump");// 设置消息标签，如果带了这个标签，会在回执中推送给CP用于检测某种类型消息的到达率和状态
			// oExt.put("icon",
			// "http://pic.qiantucdn.com/58pic/12/38/18/13758PIC4GV.jpg");//
			// 自定义推送消息在通知栏的图标,value为一个公网可以访问的URL

			JSONObject oHps = new JSONObject();// 华为PUSH消息总结构体
			oHps.put("msg", oMsg);
			oHps.put("ext", oExt);

			JSONObject oPayload = new JSONObject();
			oPayload.put("hps", oHps);

			String postBody = MessageFormat.format(
					"access_token={0}&nsp_svc={1}&nsp_ts={2}&device_token_list={3}&payload={4}",
					URLEncoder.encode(sAccessToken, "UTF-8"), URLEncoder.encode("openpush.message.api.send", "UTF-8"),
					URLEncoder.encode(String.valueOf(System.currentTimeMillis() / 1000), "UTF-8"),
					URLEncoder.encode(aDeviceTokens.toString(), "UTF-8"),
					URLEncoder.encode(oPayload.toString(), "UTF-8"));
			String postUrl = sApiUrl + "?nsp_ctx="
					+ URLEncoder.encode("{\"ver\":\"1\", \"appId\":\"" + sAppId + "\"}", "UTF-8");
			this.httpPost(postUrl, postBody, 5000, 5000);
			return Utils.getSuccessJSON();
		} catch (Exception e) {
			e.printStackTrace();
			LogsUtil.writeLogs(e, "");
			return Utils.encapsulationErrorJSON("", e);
		}
	}

	/**
	 * 获取下发通知消息的认证Token
	 * 
	 * @param appId
	 * @param appSecret
	 * @return
	 * @throws IOException
	 */
	private String getAccessToken(String appId, String appSecret) throws IOException {
		String msgBody = MessageFormat.format("grant_type=client_credentials&client_secret={0}&client_id={1}",
				URLEncoder.encode(appSecret, "UTF-8"), appId);
		String response = httpPost(sTokenUrl, msgBody, 5000, 5000);
		JSONObject obj = JSONObject.fromObject(response);
		return obj.getString("access_token");
	}

	public String httpPost(String httpUrl, String data, int connectTimeout, int readTimeout) throws IOException {
		OutputStream outPut = null;
		HttpURLConnection urlConnection = null;
		InputStream in = null;

		try {
			URL url = new URL(httpUrl);
			urlConnection = (HttpURLConnection) url.openConnection();
			urlConnection.setRequestMethod("POST");
			urlConnection.setDoOutput(true);
			urlConnection.setDoInput(true);
			urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			urlConnection.setConnectTimeout(connectTimeout);
			urlConnection.setReadTimeout(readTimeout);
			urlConnection.connect();

			// POST data
			outPut = urlConnection.getOutputStream();
			outPut.write(data.getBytes("UTF-8"));
			outPut.flush();

			// read response
			if (urlConnection.getResponseCode() < 400) {
				in = urlConnection.getInputStream();
			} else {
				in = urlConnection.getErrorStream();
			}

			List<String> lines = IOUtils.readLines(in, urlConnection.getContentEncoding());
			StringBuffer strBuf = new StringBuffer();
			for (String line : lines) {
				strBuf.append(line);
			}
			return strBuf.toString();
		} finally {
			IOUtils.closeQuietly(outPut);
			IOUtils.closeQuietly(in);
			if (urlConnection != null) {
				urlConnection.disconnect();
			}
		}
	}
}