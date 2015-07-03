using System.Configuration;

namespace FIFA.Server.Infrastructure
{
    /// <summary>
    /// Configuration section for setting up Cors policies,
    /// </summary>
    public class CorsSection : ConfigurationSection
    {
        [ConfigurationProperty("corsPolicies", IsDefaultCollection = true)]
        public CorsElementCollection CorsPolicies
        {
            get { return (CorsElementCollection)this["corsPolicies"]; }
            set { this["corsPolicies"] = value; }
        }
    }

    [ConfigurationCollection(typeof(CorsElement))]
    public class CorsElementCollection : ConfigurationElementCollection
    {
        protected override ConfigurationElement CreateNewElement()
        {
            return new CorsElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((CorsElement)element).Name;
        }
    }

    /// <summary>
    /// A configuration element for a Cors policy.
    /// </summary>
    public class CorsElement : ConfigurationElement
    {
        [ConfigurationProperty("name", IsKey = true, IsRequired = true)]
        public string Name
        {
            get { return (string)this["name"]; }
            set { this["name"] = value; }
        }

        [ConfigurationProperty("origins", IsRequired = true)]
        public string Origins
        {
            get { return (string)this["origins"]; }
            set { this["origins"] = value; }
        }

        [ConfigurationProperty("methods", IsRequired = true)]
        public string Methods
        {
            get { return (string)this["methods"]; }
            set { this["methods"] = value; }
        }

        [ConfigurationProperty("headers", IsRequired = false)]
        public string Headers
        {
            get { return (string)this["headers"]; }
            set { this["headers"] = value; }
        }
    }
}