using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(ExpenseTracker.WebApi.Startup))]

namespace ExpenseTracker.WebApi
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {           
            ConfigureAuth(app);
        }
    }
}
