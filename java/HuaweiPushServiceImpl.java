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
 * ��Ϊ����
 * 
 * @author Jiangxz
 * 
 */
public class HuaweiPushServiceImpl {
	private String sTokenUrl = "https://login.cloud.huawei.com/oauth2/v2/token"; // ��ȡ��֤Token��URL
	private String sApiUrl = "https://api.push.hicloud.com/pushsend.do"; // Ӧ�ü���Ϣ�·�API

	// ����Push��Ϣ
	public String sendMessage(String configure, String pushtoken, String userId, String message) {
		try {
			JSONObject jsonObj = JSONObject.fromObject(configure);
			String sAppId = jsonObj.getString("AppId"); // �û��ڻ�Ϊ���������������appId��appSecret����Ա����->�ҵĲ�Ʒ�������Ʒ��Ӧ��Push���񣬵�����ƶ�Ӧ�����顱��ȡ��
			String sAppSecret = jsonObj.getString("AppSecret");
			String sTitle = jsonObj.getString("Title");// ��Ʒ����
			String sPackageName = jsonObj.getString("PackageName");
			String sAccessToken = this.getAccessToken(sAppId, sAppSecret);
			JSONArray aDeviceTokens = new JSONArray();// Ŀ���豸Token
			aDeviceTokens.add(pushtoken);

			JSONObject oBody = new JSONObject();// ��֪ͨ����Ϣ��Ҫ���ñ�������ݣ�͸����Ϣkey��valueΪ�û��Զ���
			oBody.put("title", sTitle);// ��Ϣ����
			oBody.put("content", message);// ��Ϣ������

			JSONObject oParam = new JSONObject();
			oParam.put("appPkgName", sPackageName);// ������Ҫ�򿪵�appPkgName

			JSONObject oAction = new JSONObject();
			oAction.put("type", 3);// ����3Ϊ��APP��������Ϊ��ο��ӿ��ĵ�����
			oAction.put("param", oParam);// ��Ϣ�����������

			JSONObject oMsg = new JSONObject();
			oMsg.put("type", 3);// 3: ֪ͨ����Ϣ���첽͸����Ϣ����ݽӿ��ĵ�����
			oMsg.put("action", oAction);// ��Ϣ�������
			oMsg.put("body", oBody);// ֪ͨ����Ϣbody����

			JSONObject oExt = new JSONObject();// ��չ��Ϣ����BI��Ϣͳ�ƣ��ض�չʾ�����Ϣ�۵���
			oExt.put("biTag", "Trump");// ������Ϣ��ǩ��������������ǩ�����ڻ�ִ�����͸�CP���ڼ��ĳ��������Ϣ�ĵ����ʺ�״̬
			// oExt.put("icon",
			// "http://pic.qiantucdn.com/58pic/12/38/18/13758PIC4GV.jpg");//
			// �Զ���������Ϣ��֪ͨ����ͼ��,valueΪһ���������Է��ʵ�URL

			JSONObject oHps = new JSONObject();// ��ΪPUSH��Ϣ�ܽṹ��
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
	 * ��ȡ�·�֪ͨ��Ϣ����֤Token
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