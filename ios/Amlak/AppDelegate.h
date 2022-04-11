#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <FirebaseMessaging.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, FIRMessagingDelegate,UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
