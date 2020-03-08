//
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
//
#import "RCTChirpSDK.h"

@implementation RCTChirpSDK

ChirpSDK *chirp;

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  return @{
    @"CHIRP_SDK_STATE_NOT_CREATED": [NSNumber numberWithInt:CHIRP_SDK_STATE_NOT_CREATED],
    @"CHIRP_SDK_STATE_STOPPED": [NSNumber numberWithInt:CHIRP_SDK_STATE_STOPPED],
    @"CHIRP_SDK_STATE_RUNNING": [NSNumber numberWithInt:CHIRP_SDK_STATE_RUNNING],
    @"CHIRP_SDK_STATE_SENDING": [NSNumber numberWithInt:CHIRP_SDK_STATE_SENDING],
    @"CHIRP_SDK_STATE_RECEIVING": [NSNumber numberWithInt:CHIRP_SDK_STATE_RECEIVING]
  };
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[
    @"onStateChanged",
    @"onSending",
    @"onSent",
    @"onReceiving",
    @"onReceived",
    @"onError"
  ];
}

/**
 * init(key, secret)
 *
 * Initialise the SDK with an application key and secret.
 * Callbacks are also set up here.
 */
RCT_EXPORT_METHOD(init:(NSString *)key secret:(NSString *)secret)
{
  chirp = [[ChirpSDK alloc] initWithAppKey:key
                                 andSecret:secret];

  [chirp setStateUpdatedBlock:^(CHIRP_SDK_STATE oldState,
                                CHIRP_SDK_STATE newState)
   {
     [self sendEventWithName:@"onStateChanged" body:@{@"status": [NSNumber numberWithInt:newState]}];
   }];

  [chirp setSendingBlock:^(NSData * _Nonnull data, NSUInteger channel)
   {
     NSArray *payload = [self dataToArray: data];
     [self sendEventWithName:@"onSending" body:@{@"data": payload}];
   }];

  [chirp setSentBlock:^(NSData * _Nonnull data, NSUInteger channel)
   {
     NSArray *payload = [self dataToArray: data];
     [self sendEventWithName:@"onSent" body:@{@"data": payload}];
   }];

  [chirp setReceivingBlock:^(NSUInteger channel)
   {
     [self sendEventWithName:@"onReceiving" body:@{}];
   }];

  [chirp setReceivedBlock:^(NSData * _Nullable data, NSUInteger channel)
   {
     NSArray *payload = [self dataToArray: data];
     [self sendEventWithName:@"onReceived" body:@{@"data": payload}];
   }];

  [chirp setAuthenticatedBlock:^(NSError * _Nullable error) {
    if (error) {
      [self sendEventWithName:@"onError" body:@{@"message": [error localizedDescription]}];
    }
  }];
}

/**
 * setConfigFromNetwork()
 *
 * Fetch default licence from network to configure the SDK.
 */
RCT_EXPORT_METHOD(setConfigFromNetwork:(RCTPromiseResolveBlock)resolve
                              rejecter:(RCTPromiseRejectBlock)reject)
{
    [chirp setConfigFromNetworkWithCompletion:^(NSError * _Nullable error) {
      if (error) {
        reject(@"Error", @"Authentication Error", error);
      } else {
        resolve(@"Initialisation Success");
      }
    }];
}

/**
 * setConfig(config)
 *
 * Configure the SDK with a config string.
 */
RCT_EXPORT_METHOD(setConfig:(NSString *)config)
{
  NSError *err = [chirp setConfig:config];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * start()
 *
 * Starts the SDK.
 */
RCT_EXPORT_METHOD(start)
{
  NSError *err = [chirp start];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * stop()
 *
 * Stops the SDK.
 */
RCT_EXPORT_METHOD(stop)
{
  NSError *err = [chirp stop];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * send(data)
 *
 * Sends a payload of NSData to the speaker.
 */
RCT_EXPORT_METHOD(send: (NSArray *)data)
{
  NSData *payload = [self arrayToData: data];
  NSError *err = [chirp send:payload];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * sendRandom()
 *
 * Sends a random payload to the speaker.
 */
RCT_EXPORT_METHOD(sendRandom)
{
  NSUInteger length = 1 + arc4random() % (chirp.maxPayloadLength - 1);
  NSData *data = [chirp randomPayloadWithLength:length];
  NSError *err = [chirp send:data];
  if (err) {
    [self sendEventWithName:@"onError" body:@{@"message": [err localizedDescription]}];
  }
}

/**
 * dataToArray
 *
 * Internal function to convert NSData payloads
 * to NSArray of bytes. React Native doesn't support NSData.
 */
- (NSArray *)dataToArray: (NSData *) data
{
  Byte *bytes = (Byte*)[data bytes];
  NSMutableArray *payload = [NSMutableArray arrayWithCapacity:data.length];
  for (int i = 0; i < data.length; i++) {
    [payload addObject:[NSNumber numberWithInt:bytes[i]]];
  }
  return [NSArray arrayWithArray:payload];
}

/**
 * arrayToData
 *
 * Internal function to convert NSArray payloads
 * to NSData. React Native doesn't support NSData.
 */
- (NSData *)arrayToData: (NSArray *) array
{
  Byte bytes[[array count]];
  for (int i = 0; i < [array count]; i++) {
    bytes[i] = [[array objectAtIndex:i] integerValue];
  }
  NSData *payload = [[NSData alloc] initWithBytes:bytes length:[array count]];
  return payload;
}

@end

