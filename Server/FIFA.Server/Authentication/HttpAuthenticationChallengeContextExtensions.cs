﻿﻿using System;
using System.Net.Http.Headers;
using System.Web.Http.Filters;

namespace FIFA.Server.Authentication
{
    public static class HttpAuthenticationChallengeContextExtensions
    {
        public static void ChallengeWith(this HttpAuthenticationChallengeContext context, string scheme)
        {
            ChallengeWith(context, new AuthenticationHeaderValue(scheme));
        }

        public static void ChallengeWith(this HttpAuthenticationChallengeContext context, string scheme, string parameter)
        {
            ChallengeWith(context, new AuthenticationHeaderValue(scheme, parameter));
        }

        public static void ChallengeWith(this HttpAuthenticationChallengeContext context, AuthenticationHeaderValue challenge)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            // Desactivating the popup showing the authentication popup in order to use the one in the client side
            // context.Result = new AddChallengeOnUnauthorizedResult(challenge, context.Result);
        }
    }
}