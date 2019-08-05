package com.ruobilin.platform.servicerest;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.ruobilin.platform.service.HuaweiPushServiceImpl;
/**
 * 华为推送
 * 
 * @author Jiangxz
 * 
 */
@Path("HuaweiPushService")
public class HuaweiPushService {

	private HuaweiPushServiceImpl mHuaweiPushServiceImpl = new HuaweiPushServiceImpl();

	public HuaweiPushService() {

	}

	@Path("sendMessage")
	@POST
	@Produces("application/json")
	public String sendMessage(@FormParam("configure") String configure, @FormParam("pushUserId") String pushUserId,
			@FormParam("pushtoken") String pushtoken, @FormParam("message") String message) {
		return this.mHuaweiPushServiceImpl.sendMessage(configure, pushtoken, pushUserId, message);
	}
}
